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
    toast.success("Logged out successfully!", { position: "top-center" });
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <div className="container-fluid">

        {/* 🔥 FIXED navbar collapse */}
        <div
          className="navbar-collapse"
          id="navbarTogglerDemo01"
          style={{
            background: "transparent",
            padding: "0",
            width: "100%"
          }}
        >
          <Link
            to="/"
            className="navbar-brand"
            style={{ fontWeight: "bold" }}
          >
            🛒 Ecommerce App
          </Link>

          <ul
            className="navbar-nav ms-auto mb-2 mb-lg-0"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px"
            }}
          >

            <li className="nav-item" style={{ margin: "5px" }}>
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown" style={{ margin: "5px" }}>
              <button
                className="nav-link dropdown-toggle"
                type="button"
                onClick={() => setCategoryDropdownOpen(prev => !prev)}
                style={{ background: "none", border: "none" }}
              >
                Categories
              </button>

              <ul
                className={`dropdown-menu ${categoryDropdownOpen ? 'show' : ''}`}
                style={{
                  position: "absolute",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                }}
              >
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>

                {categories?.map(category => (
                  <li key={category._id}>
                    <Link
                      className="dropdown-item"
                      to={`/category/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item" style={{ margin: "5px" }}>
              <Badge count={cart.length} showZero>
                <NavLink to="/cart" className="nav-link">Cart</NavLink>
              </Badge>
            </li>

            {/* Auth */}
            {!auth?.user ? (
              <>
                <li className="nav-item" style={{ margin: "5px" }}>
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
                <li className="nav-item" style={{ margin: "5px" }}>
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown" style={{ margin: "5px" }}>
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  onClick={() => setAdminDropdownOpen(prev => !prev)}
                  style={{ background: "none", border: "none" }}
                >
                  {auth?.user?.name}
                </button>

                <ul
                  className={`dropdown-menu ${adminDropdownOpen ? 'show' : ''}`}
                  style={{
                    position: "absolute",
                    background: "#fff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                  }}
                >
                  <li>
                    <NavLink
                      to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
