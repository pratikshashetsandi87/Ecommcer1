import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import api from "../api.js";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/Productdetails.css";
import { toast, ToastContainer } from "react-toastify";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await api.get(`/product/getsingle-product/${params.slug}`);

        if (data?.product) {
          setProduct(data.product);

          // ✅ FIX: handle both object + string category
          const categoryId =
            data.product.category?._id || data.product.category;

          if (categoryId) {
            getSimilarProduct(data.product._id, categoryId);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getSimilarProduct = async (pid, cid) => {
      try {
        const { data } = await api.get(`/product/related-product/${pid}/${cid}`);
        setRelatedProducts(data?.products || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (params?.slug) getProduct();
  }, [params?.slug]);

  const handleAddToCart = () => {
    toast.success("Item added to cart!");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <Layout>

      {/* ================= PRODUCT DETAILS ================= */}
      <div className="row container product-details">

        {/* IMAGE */}
        <div className="col-md-6">
          <img
            src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${product._id}`}
            alt={product.name}
            style={{
              height: '400px',
              width: '100%',
              objectFit: 'contain',
              background: "#f5f5f5",
              padding: "10px"
            }}
          />
        </div>

        {/* DETAILS */}
        <div className="col-md-6 product-details-info">
          <h1>Product Details</h1>
          <hr />

          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>

          <h6>
            Price:
            {product.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </h6>

          <h6>Category: {product.category?.name || "N/A"}</h6>

          <button
            className="btn btn-secondary"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </div>

      </div>

      <hr />

      {/* ================= SIMILAR PRODUCTS ================= */}
      <div className="container similar-products">
        <h4>Similar Products ➡️</h4>

        {relatedProducts.length < 1 ? (
          <p>No Similar Products</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px"
            }}
          >
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }}
              >

                {/* IMAGE */}
                <img
                  src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`}
                  alt={p.name}
                  style={{
                    height: '200px',
                    width: '100%',
                    objectFit: 'contain',
                    background: "#f5f5f5"
                  }}
                />

                {/* TEXT */}
                <h5 style={{ marginTop: "10px" }}>{p.name}</h5>
                <p style={{ color: "green" }}>₹ {p.price}</p>

                {/* BUTTON */}
                <button
                  className="btn btn-info"
                  style={{ width: "100%" }}
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default ProductDetails;