import React from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ user: null, token: "" });
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">
          🛒 Ecommerce App
        </Link>

        {/* 🔥 MOBILE TOGGLE BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="navbarContent">

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Categories
              </span>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>

                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <li key={c._id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Badge count={cart.length} showZero>
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
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {auth.user.name}
                </span>

                <ul className="dropdown-menu">
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
