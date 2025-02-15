import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../middleware/AuthContext";

const ProfilePage = () => {
  const [name, setName] = useState("user");
  const [email, setEmail] = useState("user@example.com");
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [triger, setTriger] = useState(false);

  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const user = localStorage.getItem("user");

  useEffect(() => {
    fetch("http://localhost:4000/api/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setName(data.name); // Update state with the fetched data
        setEmail(data.email); // Set loading to false once data is loaded
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:4000/api/orders${
        JSON.parse(user)?.role === "admin" ? "" : "/order"
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setHistoryOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [triger]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profil berhasil diperbarui!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/orders/" + selectedOrder?.orderId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Status berhasil diperbarui!");
        setIsModalOpen(false);
        setTriger(!triger);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const handleClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleLogout = () => {
    // Simulasikan logout dan arahkan ke halaman login
    logout();
    alert("Anda telah keluar!");
    navigate("/login");
  };

  return (
    // <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Profil Pengguna</h2>

      <form onSubmit={handleSave} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-600"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            placeholder="Masukkan Username"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            placeholder="Masukkan Email"
            required
          />
        </div>

        {JSON.parse(user)?.role == "admin" && (
          <Link to="/dashboard">
            <button className="bg-gray-500 w-full text-white py-2 px-4 rounded-md hover:bg-gray-600 transition mb-4">
              Pergi ke Dashboard
            </button>
          </Link>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Riwayat Pesanan {JSON.parse(user)?.role === "admin" && "Customer"}</h2>

      <div className="space-y-2">
        {historyOrders.map((item) => (
          <div
            key={item.orderId}
            className="flex items-center justify-between py-2 px-4 rounded-lg border border-gray-300"
          >
            <div>
              <h3 className="font-semibold">#order {item.orderId}</h3>
              <p className="text-gray-700">
                Rp {Number(item.total_price).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleClick(item)}
              className="bg-blue-500 text-white py-1 px-2 text-sm rounded-md hover:bg-blue-600 transition"
            >
              Detail
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Order #{selectedOrder.orderId} Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <span className="text-xl text-red-500 shadow px-1.5 rounded-full">
                  &times;
                </span>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium">
                Total Price: Rp{" "}
                {Number(selectedOrder.total_price).toLocaleString()}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Order Items:</h3>
                <ul className="space-y-2">
                  {selectedOrder.order_items.map((item) => (
                    <li key={item.product_id} className="flex justify-between">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-between mb-4">
              <p>Status: {selectedOrder.status}</p>
              <p>Payment Method: {selectedOrder.payment_method}</p>
              <p>Address: {selectedOrder.address}</p>
            </div>

            {selectedOrder.status === "pending" && (
              <button
                onClick={handleUpdateOrder}
                className="bg-blue-500 text-white py-1 px-2 text-sm rounded-md hover:bg-blue-600 transition"
              >
                Completed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
