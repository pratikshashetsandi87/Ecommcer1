import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        // ✅ FIXED URL
        "https://watchecom-backend.onrender.com/api/auth/product/getall-product"
      );

      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const loadMoreProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 8);
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        // ✅ FIXED URL
        `https://watchecom-backend.onrender.com/api/auth/product/delete-product/${productId}`
      );

      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <div className="row dashboard">

        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>

          <div className="d-flex flex-wrap">
            {products.slice(0, visibleProducts).map((p) => (
              <div key={p._id} className="product-link">

                <div className="card m-2" style={{ width: "18rem" }}>

                  {/* ✅ FIXED IMAGE */}
                  <img
                    src={`https://watchecom-backend.onrender.com/api/auth/product/getproduct-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />

                  <div className="card-body">
                    <h5>{p.name}</h5>

                    <p>{p.description?.substring(0, 60)}...</p>

                    <div className="d-flex justify-content-between">
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
                </div>

              </div>
            ))}
          </div>

          {visibleProducts < products.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-secondary"
                onClick={loadMoreProducts}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
}

export default Products;