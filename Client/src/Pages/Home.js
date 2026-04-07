import React, { useState, useEffect } from "react";
import api from "../api"; // ✅ FIX
import { Checkbox, Radio, Input } from "antd";
import { Prices } from "../Context/Prices";
import Layout from "../Layout/Layout";
import { useCart } from "../Context/Cart";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/auth";
import "../Style/Homepage.css";

const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { auth } = useAuth();

  // LOAD
  useEffect(() => {
    getAllCategory();
    getAllProducts();
  }, []);

  // CATEGORY
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/category/getall-category");
      setCategories(data?.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  // PRODUCTS
  const getAllProducts = async () => {
    try {
      const { data } = await api.get("/product/getall-product");
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      if (!all.includes(id)) all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // FILTER LOGIC
  useEffect(() => {
    if (checked.length > 0 || radio.length > 0 || searchQuery !== "") {
      filterProduct();
    } else {
      getAllProducts();
    }
  }, [checked, radio, searchQuery]);

  const filterProduct = async () => {
    try {
      const { data } = await api.post("/product/product-filters", {
        checked,
        radio,
        searchQuery,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // CART
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Item Added To Cart");
  };

  return (
    <Layout title="All Products">

      {/* BANNER */}
   <img
  src="https://github.com/techinfo-youtube/ecommerce-app-2023/blob/15-admin-orders-css/client/public/images/banner.png?raw=true"
  alt="banner"
  style={{
    width: "100%",
    height: "180px", // 👈 reduce height
    objectFit: "cover",
    marginTop: "60px", // 👈 perfect navbar gap
    marginBottom: "10px",
  }}
/>

      <div className="container-fluid mt-3">
        <div className="row">

          {/* FILTER */}
          <div className="col-md-3">
            <div className="filters">

              <h4>Category</h4>
              {categories.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}

              <h4>Price</h4>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices.map((p) => (
                  <Radio key={p._id} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                  setSearchQuery("");
                  getAllProducts();
                }}
              >
                Reset Filters
              </button>

            </div>
          </div>

          {/* PRODUCTS */}
          <div className="col-md-9">

            {/* HEADING */}
            <h1
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: "600"
              }}
            >
              All Products
            </h1>

            {/* SEARCH */}
            <Search
              placeholder="Search products"
              enterButton
              onSearch={(value) => setSearchQuery(value)}
              style={{ marginBottom: "15px" }}
            />

            {/* GRID */}
            <div className="home-page">

              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "420px",
                    padding: "10px"
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
                      background: "#f5f5f5"
                    }}
                  />

                  {/* TEXT */}
                  <h5>{p.name}</h5>

                  <p style={{
  fontSize: "13px",
  color: "#666",
  height: "40px",
  overflow: "hidden"
}}>
  {p.description?.substring(0, 40)}...
</p>

                  <p style={{ color: "green", fontWeight: "bold" }}>
                    ₹ {p.price}
                  </p>

                  {/* BUTTONS */}
                 <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "10px"
  }}
>

  <button
    style={{
      padding: "8px",
      border: "none",
      borderRadius: "6px",
      background: "#007bff",
      color: "#fff",
      cursor: "pointer"
    }}
    onClick={() => navigate(`/product/${p.slug}`)}
  >
    View Details
  </button>

  <button
    style={{
      padding: "8px",
      border: "none",
      borderRadius: "6px",
      background: "#28a745",
      color: "#fff",
      cursor: "pointer"
    }}
    onClick={() => handleAddToCart(p)}
  >
    Add to Cart
  </button>

</div>

                </div>
              ))}

            </div>

          </div>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default HomePage;
