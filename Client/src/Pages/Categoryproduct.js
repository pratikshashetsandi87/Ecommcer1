import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useCart } from "../Context/Cart";
import { toast } from "react-toastify";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { cart, setCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      getProducts();
    }
  }, [params.slug]);

  const getProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `https://watchecom-backend.onrender.com/api/product/product-category/${params.slug}`
      );

      setProducts(data?.products || []);
      setLoading(false);

    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  };

  // ✅ ADD TO CART FUNCTION
  const handleAddToCart = (product) => {
    let updatedCart = [...cart, product];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast.success("Item added to cart");

    // ✅ redirect to cart
    navigate("/cart");
  };

  return (
    <Layout>
      <h2 style={{ textAlign: "center" }}>
        Category: {params.slug}
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No Products Found</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px"
        }}>
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
              }}
            >
              {/* IMAGE */}
              <img
                src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "contain"
                }}
              />

              {/* TEXT */}
              <h5>{p.name}</h5>
              <p>₹ {p.price}</p>

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>

                {/* VIEW */}
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  View
                </button>

                {/* ADD TO CART */}
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default CategoryProduct;