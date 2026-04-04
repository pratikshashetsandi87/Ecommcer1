import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useAuth();

  // ================= API =================
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://watchecom-backend.onrender.com/api/auth/category/getall-category"
      );

      // ✅ FIX
      if (data.success) setCategories(data?.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://watchecom-backend.onrender.com/api/auth/product/getall-product"
      );

      // ✅ FIX
      setProducts(data?.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "https://watchecom-backend.onrender.com/api/auth/product/product-count"
      );

      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FILTER =================
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length && !radio.length && !searchQuery) {
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, radio, searchQuery]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "https://watchecom-backend.onrender.com/api/auth/product/product-filters",
        { checked, radio, searchQuery }
      );

      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Item Added To Cart");
  };

  // ================= UI =================
  return (
    <Layout title="All Products - Best offers">
      {/* BANNER */}
      <img
        src="https://github.com/techinfo-youtube/ecommerce-app-2023/blob/15-admin-orders-css/client/public/images/banner.png?raw=true"
        className="banner-img"
        alt="banner"
        width="100%"
      />

      <div className="container-fluid mt-3">
        <div className="row">

          {/* FILTER SIDEBAR */}
          <div className="col-md-3">
            <div className="filters">
              <h4>Filter By Category</h4>
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}

              <h4>Filter By Price</h4>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <Radio key={p._id} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <button
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                  setSearchQuery("");
                  getAllProducts();
                }}
              >
                RESET FILTERS
              </button>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>

            <Search
              placeholder="Search products"
              enterButton
              onSearch={(value) => setSearchQuery(value)}
              style={{ marginBottom: "15px" }}
            />

            <div className="home-page">
              {products?.map((p) => (
                <div className="card" key={p._id}>
                  
                  {/* ✅ FIXED IMAGE URL */}
                  <img
                    src={`https://watchecom-backend.onrender.com/api/auth/product/getproduct-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>

                    <p className="card-text">
                      {p.description?.substring(0, 40)}...
                    </p>

                    <p className="card-price">₹ {p.price}</p>

                    <div className="card-buttons">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            {products.length < total && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-warning"
                  onClick={() => setPage(page + 1)}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default HomePage;