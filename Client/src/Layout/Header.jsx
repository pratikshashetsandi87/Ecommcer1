import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from '../Context/auth';
import useCategory from '../Hook/UseCategory';
import { useCart } from '../Context/Cart';
import { Badge } from 'antd';
import '../Style/Header.css';

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
    <nav className="navbar bg-body-tertiary fixed-top">
      <div className="container-fluid">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">
          🛒 Ecommerce App
        </Link>

        {/* ✅ ALWAYS VISIBLE MENU */}
        <div className="navbar-collapse">

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" style={{
            display: "flex",
            flexWrap: "wrap",   // ✅ mobile wrap
            gap: "10px"
          }}>
            
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                type="button"
                onClick={() => setCategoryDropdownOpen(prev => !prev)}
              >
                Categories
              </button>

              <ul className={`dropdown-menu ${categoryDropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>

                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(category => (
                    <li key={category._id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${category.slug}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No categories available</li>
                )}
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Badge count={cart.length} showZero offset={[10, -5]}>
                <NavLink to="/cart" className="nav-link">Cart</NavLink>
              </Badge>
            </li>

            {/* Auth */}
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  onClick={() => setAdminDropdownOpen(prev => !prev)}
                >
                  {auth?.user?.name}
                </button>

                <ul className={`dropdown-menu ${adminDropdownOpen ? 'show' : ''}`}>
                  <li>
                    <NavLink
                      to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
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
