import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";
import api from "../api.js";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../Layout/Layout";
import "../Style/Cartpage.css";

const CartPage = () => {
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const { cart, setCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  // ================= TOTAL =================
  const totalPrice = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    return `₹ ${total.toFixed(2)}`;
  };

  // ================= REMOVE ITEM =================
  const removeItem = (id) => {
    const updated = cart.filter((p) => p._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Removed from cart");
  };

  // ================= GET TOKEN =================
  useEffect(() => {
    const getToken = async () => {
      try {
        if (!auth?.token) return;

        const { data } = await api.get('/product/braintree/token');
        setClientToken(data?.clientToken);
      } catch (error) {
        console.log(error);
      }
    };

    getToken();
  }, [auth?.token]);

  // ================= IMAGE ERROR =================
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getImageSrc = (p) => {
    if (imageErrors[p._id]) return "/placeholder-image.jpg";

    // ✅ FIXED IMAGE URL
    return `https://watchecom-backend.onrender.com/api/auth/product/getproduct-photo/${p._id}`;
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!auth?.token) {
      toast.error("Login first");
      navigate("/login");
      return;
    }

    if (!instance) return; // ✅ safety

    try {
      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await api.post(
        "/product/braintree/payment",
        { nonce, cart }
      );

      setLoading(false);

      if (data.success) {
        localStorage.removeItem("cart");
        setCart([]);
        toast.success("Payment Done");
        navigate("/orders");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Payment failed");
    }
  };

  return (
    <Layout>
      <div className="modern-cart">

        <h1 className="title"></h1>

        <div className="cart-grid">

          {/* ================= ITEMS ================= */}
          <div className="cart-items">
            {cart.map((p) => (
              <div className="modern-card" key={p._id}>

                <img
                  src={getImageSrc(p)}
                  alt={p.name}
                  onError={() => handleImageError(p._id)}
                />

                <div className="info">
                  <h4>{p.name}</h4>

                  {/* ✅ SAFE */}
                  <p>{p.description?.substring(0, 40)}...</p>

                  <span>₹ {p.price}</span>
                </div>

                <button onClick={() => removeItem(p._id)}>
                  ✕
                </button>

              </div>
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="summary">
            <h2>Total</h2>
            <h1>{totalPrice()}</h1>

            {auth?.user?.address ? (
              <p>{auth.user.address}</p>
            ) : (
              <button onClick={() => navigate("/login")}>
                Login First
              </button>
            )}

            {auth?.token && clientToken && (
              <>
                <DropIn
                  options={{ authorization: clientToken }}
                  onInstance={(i) => setInstance(i)}
                />

                <button
                  className="pay"
                  onClick={handlePayment}
                  disabled={!instance || loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </>
            )}
          </div>

        </div>

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default CartPage; 