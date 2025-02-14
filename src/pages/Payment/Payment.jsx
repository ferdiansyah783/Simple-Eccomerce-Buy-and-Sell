import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAdress] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  console.log(cart);

  const handlePayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ paymentMethod, address, cartItems: cart }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Pembayaran berhasil!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  if (!cart.length) {
    return <div>No items in your cart!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Pembayaran</h1>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-300"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-700">
                  Rp {Number(item.price).toLocaleString()} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="my-4">
          Total yang harus dibayar: Rp {totalAmount.toLocaleString()}
        </p>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-600"
          >
            address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAdress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            placeholder="Masukkan address"
            required
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Pilih Metode Pembayaran</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Kartu Kredit">Kartu Kredit</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
