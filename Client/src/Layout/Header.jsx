import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from '../Context/auth';
import useCategory from '../Hook/UseCategory';
import { useCart } from '../Context/Cart';
import { Badge } from 'antd';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();
  const categories = useCategory();
  const navigate = useNavigate();

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ user: null, token: "" });
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#fff",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          flexWrap: "wrap"
        }}
      >

        {/* LOGO */}
        <Link to="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
          🛒 Ecommerce App
        </Link>

        {/* MENU */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "15px",
            margin: 0,
            padding: 0,
            flexWrap: "wrap"
          }}
        >

          <li>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              Home
            </NavLink>
          </li>

          {/* Categories */}
          <li style={{ position: "relative" }}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer"
              }}
            >
              Categories ⬇
            </button>

            {categoryDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  background: "#fff",
                  padding: "10px",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
                }}
              >
                <Link to="/categories">All Categories</Link>

                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <div key={c._id}>
                      <Link to={`/category/${c.slug}`}>
                        {c.name}
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </li>

          {/* Cart */}
          <li>
            <Badge count={cart.length} showZero>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                Cart
              </NavLink>
            </Badge>
          </li>

          {/* Auth */}
          {!auth?.user ? (
            <>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </>
          ) : (
            <li style={{ position: "relative" }}>
              <button
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                {auth.user.name} ⬇
              </button>

              {adminDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    background: "#fff",
                    padding: "10px",
                    boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <NavLink
                    to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}
                  >
                    Dashboard
                  </NavLink>

                  <br />

                  <button
                    onClick={handleLogout}
                    style={{
                      border: "none",
                      background: "none",
                      color: "red",
                      cursor: "pointer"
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
};

export default Header;
