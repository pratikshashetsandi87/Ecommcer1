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
  const [menuOpen, setMenuOpen] = useState(false); // ✅ mobile menu

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
        }}
      >
        {/* LOGO */}
        <Link to="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
          🛒 Ecommerce App
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "block",
            border: "none",
            background: "transparent",
            fontSize: "20px",
          }}
        >
          ☰
        </button>
      </div>

      {/* MENU */}
      <div
        style={{
          display: menuOpen ? "block" : "none",
          background: "#fff",
          padding: "10px",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>

          <li>
            <NavLink to="/" style={{ display: "block", padding: "8px" }}>
              Home
            </NavLink>
          </li>

          {/* Categories */}
          <li>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              style={{ border: "none", background: "none", padding: "8px" }}
            >
              Categories ⬇
            </button>

            {categoryDropdownOpen && (
              <div style={{ paddingLeft: "10px" }}>
                <Link to="/categories">All Categories</Link>

                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <div key={c._id}>
                      <Link to={`/category/${c.slug}`}>{c.name}</Link>
                    </div>
                  ))}
              </div>
            )}
          </li>

          {/* Cart */}
          <li>
            <NavLink to="/cart" style={{ padding: "8px", display: "block" }}>
              Cart ({cart.length})
            </NavLink>
          </li>

          {/* Auth */}
          {!auth?.user ? (
            <>
              <li>
                <NavLink to="/register" style={{ padding: "8px", display: "block" }}>
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" style={{ padding: "8px", display: "block" }}>
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  style={{ border: "none", background: "none", padding: "8px" }}
                >
                  {auth.user.name} ⬇
                </button>

                {adminDropdownOpen && (
                  <div style={{ paddingLeft: "10px" }}>
                    <NavLink
                      to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}
                    >
                      Dashboard
                    </NavLink>

                    <br />

                    <button
                      onClick={handleLogout}
                      style={{ border: "none", background: "none", color: "red" }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
