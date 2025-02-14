// src/ProductManagement.js
import React, { useEffect, useState } from "react";

const ProductManagement = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [triger, setTriger] = useState(false);

  useEffect(() => {
    // Fetch products from the API
    fetch(
      `http://localhost:4000/api/products?search=${search}&category_id=${category}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data); // Update state with the fetched data
      })
      .catch((err) => {
        console.log(err);
      });
  }, [search, category, triger]);

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data); // Update state with the fetched data
      })
      .catch((err) => {
        console.log(err);
      });
  }, [triger]);

  const handleAddItem = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          stock: quantity,
          price,
          category: categoryName,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Barang berhasil ditambahkan!");
        setTriger(!triger);
        setName("");
        setDescription("");
        setQuantity("");
        setCategoryName("");
        setPrice("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error menambah barang");
    }
  };

  const handleEditItem = (item) => {
    setName(item.name);
    setDescription(item.description);
    setQuantity(item.stock);
    setPrice(item.price);
    setCategoryName(item.category_name);
    setIsEditing(true);
    setEditIndex(item.id);
  };

  const handleUpdateItem = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/products/" + editIndex,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            stock: quantity,
            price,
            category: categoryName,
            description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Barang berhasil diperbarui!");
        setTriger(!triger);
        setIsEditing(false);
        setName("");
        setDescription("");
        setQuantity("");
        setCategoryName("");
        setPrice("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error perbarui barang");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Apakah anda yakin ingin menghapus item ini?')) {
      try {
        const response = await fetch(
          "http://localhost:4000/api/products/" + id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Barang berhasil dihapus!");
          setTriger(!triger);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error menghapus barang");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">CRUD Barang</h1>

        {/* Form Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama Barang"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="number"
            placeholder="Jumlah"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="text"
            placeholder="Kategori"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          {isEditing ? (
            <button
              onClick={handleUpdateItem}
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Update Barang
            </button>
          ) : (
            <button
              onClick={handleAddItem}
              className="w-full bg-green-500 text-white p-2 rounded-md"
            >
              Tambah Barang
            </button>
          )}
        </div>
      </div>

      {/* Barang List */}
      <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 order-2 md:order-none md:col-span-2 lg:col-span-3 overflow-x-auto">
        {/* Search and Filter */}
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Cari Barang"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            style={{ 
              fieldSizing: 'content'
             }}
          >
            <option value="">Semua</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Nama Barang</th>
              <th className="p-2 text-left">Jumlah</th>
              <th className="p-2 text-left">Kategori</th>
              <th className="p-2 text-left">Harga</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.stock}</td>
                <td className="p-2">{item.category_name}</td>
                <td className="p-2">
                  Rp. {Number(item.price).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
