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
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#fff",
        zIndex: 1000,
        padding: "10px"
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // ✅ mobile wrap
          gap: "10px",
          alignItems: "center"
        }}
      >

        {/* LOGO */}
        <Link to="/" style={{ fontWeight: "bold" }}>
          🛒 Ecommerce
        </Link>

        {/* MAIN LINKS */}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/categories">Categories</NavLink>

        {/* SHOW ALL CATEGORIES DIRECT */}
        {Array.isArray(categories) &&
          categories.map((c) => (
            <NavLink key={c._id} to={`/category/${c.slug}`}>
              {c.name}
            </NavLink>
          ))}

        {/* CART */}
        <Badge count={cart.length} showZero>
          <NavLink to="/cart">Cart</NavLink>
        </Badge>

        {/* AUTH */}
        {!auth?.user ? (
          <>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        ) : (
          <>
            <NavLink to={auth.user.role === "admin" ? "/admindashboard" : "/dashboard"}>
              Dashboard
            </NavLink>

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
          </>
        )}

      </div>
    </nav>
  );
};

export default Header;
