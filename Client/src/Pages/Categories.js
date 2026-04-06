import React from 'react';
import useCategory from "../Hook/UseCategory";
import { Link } from "react-router-dom";
import Layout from '../Layout/Layout';
import "../Style/Categories.css";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout>
      <div className="categories-container">
        
        <h1 className="categories-heading">All Categories</h1>

        <div className="list-group">

          {/* ✅ SAFE LOADING */}
          {!categories ? (
            <div className="no-categories">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="no-categories">No categories available</div>
          ) : (
            categories.map((category) => (
              <Link 
                key={category._id} 
                className="list-group-item" 
                to={`/category/${category.slug}`}
                style={{
                  textDecoration: "none",
                  marginBottom: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  display: "block"
                }}
              >
                {category.name}
              </Link>
            ))
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Categories;