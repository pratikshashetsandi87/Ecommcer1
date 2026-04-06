import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import api from "../../api"; // ✅ FIX
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const { data } = await api.get("/product/getall-product");
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/product/delete-product/${id}`);
    setProducts(products.filter((p) => p._id !== id));
    toast.success("Deleted");
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1>All Products</h1>

          {/* 🔥 GRID FIX (INLINE) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}
              >
                {/* IMAGE */}
                <img
                  src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    background: "#f5f5f5",
                  }}
                />

                {/* TEXT */}
                <h5>{p.name}</h5>
                <p>{p.description?.substring(0, 40)}...</p>

                {/* BUTTONS */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <Link to={`/product/${p.slug}`} className="btn btn-primary">
                    View
                  </Link>

                  <Link to={`/update-product/${p.slug}`} className="btn btn-warning">
                    Update
                  </Link>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
}

export default Products;
