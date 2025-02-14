import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfilePage from "../Profile/Profile";

const Store = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    fetch("http://localhost:4000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data); // Update state with the fetched data
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((err) => {
        setError(err.message); // Handle any errors
        setLoading(false); // Set loading to false in case of error
      });
  }, []); // Empty dependency array to run once when component mounts

  const addToCart = (product, add = true) => {
    // console.log(cart);
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct && !add) {
      if (existingProduct.quantity === 1) {
        setCart(cart.filter((item) => item.id !== product.id));
      } else {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...existingProduct, quantity: existingProduct.quantity - 1 }
              : item
          )
        );
      }
    } else if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...existingProduct, quantity: existingProduct.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const goToPayment = () => {
    navigate("/payment", { state: { cart } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 order-2 md:order-none md:col-span-2 lg:col-span-3">
        <h1 className="text-2xl font-bold text-center mb-6">
          Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-200 p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-700">
                Rp {Number(product.price).toLocaleString()}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Keranjang Anda</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Keranjang Anda kosong.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-700">
                      Rp {Number(item.price).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white px-2 py-0.5 rounded-md"
                    >
                      +
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      onClick={() => addToCart(item, false)}
                      className="bg-red-500 text-white px-2.5 py-0.5 rounded-md"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-right font-semibold">
                <p>Total: Rp {calculateTotal().toLocaleString()}</p>

                <button
                  onClick={goToPayment}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Lanjutkan ke Pembayaran
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile page will be shown in the last column on large screens */}
      <ProfilePage />
    </div>
  );
};

export default Store;
