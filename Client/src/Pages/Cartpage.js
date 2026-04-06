import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";
import api from "../api";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../Layout/Layout";

const CartPage = () => {
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const { cart, setCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const totalPrice = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    return `₹ ${total.toFixed(2)}`;
  };

  const removeItem = (id) => {
    const updated = cart.filter((p) => p._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Removed from cart");
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        if (!auth?.token) return;
        const { data } = await api.get("/product/braintree/token");
        setClientToken(data?.clientToken);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, [auth?.token]);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getImageSrc = (p) => {
    if (imageErrors[p._id]) return "/placeholder-image.jpg";
    return `https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`;
  };

  const handlePayment = async () => {
    if (!auth?.token) {
      toast.error("Login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await api.post("/product/braintree/payment", {
        nonce,
        cart,
      });

      setLoading(false);

      if (data.success) {
        localStorage.removeItem("cart");
        setCart([]);
        toast.success("Payment Done");
        navigate("/orders");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed");
    }
  };

  return (
    <Layout>
      <div style={{
        padding: "30px",
        background: "#f5f7fa",
        minHeight: "100vh"
      }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600"
        }}>
          Your Cart
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px"
        }}>

          {/* ================= ITEMS ================= */}
          <div>
            {cart.length === 0 ? (
              <p style={{ textAlign: "center" }}>Cart is empty</p>
            ) : (
              cart.map((p) => (
                <div key={p._id} style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>

                  {/* IMAGE */}
                  <img
                    src={getImageSrc(p)}
                    alt={p.name}
                    onError={() => handleImageError(p._id)}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      borderRadius: "10px",
                      marginRight: "15px"
                    }}
                  />

                  {/* INFO */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px" }}>{p.name}</h4>
                    <p style={{ fontSize: "13px", color: "#666" }}>
                      {p.description?.substring(0, 40)}...
                    </p>
                    <h5 style={{ color: "green" }}>₹ {p.price}</h5>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(p._id)}
                    style={{
                      border: "none",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer"
                    }}
                  >
                    ✕
                  </button>

                </div>
              ))
            )}
          </div>

          {/* ================= SUMMARY ================= */}
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            height: "fit-content"
          }}>

            <h2>Total</h2>
            <h1 style={{ color: "green" }}>{totalPrice()}</h1>

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
                  onClick={handlePayment}
                  disabled={!instance || loading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    marginTop: "10px",
                    cursor: "pointer"
                  }}
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
