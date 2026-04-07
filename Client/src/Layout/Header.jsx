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
  const [menuOpen, setMenuOpen] = useState(false); // ✅ mobile toggle

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ user: null, token: "" });
    toast.success("Logged out successfully!", { position: "top-center" });
    navigate('/login');
  };

  return (
    <nav style={{
      background: "#fff",
      padding: "10px 20px",
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        {/* Logo */}
        <Link to="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
          🛒 Ecommerce App
        </Link>

        {/* ☰ Hamburger (mobile only) */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            fontSize: "24px",
            cursor: "pointer"
          }}
          className="hamburger"
        >
          ☰
        </div>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center"
          }}
          className={`menu ${menuOpen ? "show" : ""}`}
        >

          <NavLink to="/">Home</NavLink>

          {/* Categories */}
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              style={{ cursor: "pointer" }}
            >
              Categories ⬇
            </span>

            {categoryDropdownOpen && (
              <div style={{
                position: "absolute",
                top: "30px",
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                padding: "10px"
              }}>
                <Link to="/categories">All</Link>

                {categories?.map(c => (
                  <div key={c._id}>
                    <Link to={`/category/${c.slug}`}>{c.name}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Badge count={cart.length}>
            <NavLink to="/cart">Cart</NavLink>
          </Badge>

          {/* Auth */}
          {!auth?.user ? (
            <>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <span
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                style={{ cursor: "pointer" }}
              >
                {auth?.user?.name} ⬇
              </span>

              {adminDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "30px",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  padding: "10px"
                }}>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <br />
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ✅ MOBILE CSS */}
      <style>
        {`
        @media (max-width: 768px) {
          .hamburger {
            display: block !important;
          }

          .menu {
            display: none !important;
            flex-direction: column;
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background: white;
            padding: 15px;
          }

          .menu.show {
            display: flex !important;
          }
        }
        `}
      </style>
    </nav>
  );
};

export default Header;
