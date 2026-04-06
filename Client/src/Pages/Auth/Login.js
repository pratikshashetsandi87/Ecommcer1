import React, { useState } from 'react';
import api from '../../api'; // ✅ FIX
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../Layout/Layout';
import { useAuth } from '../../Context/auth';
import '../Auth/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post("/auth/login", formData); // ✅ FIX

      if (data?.success) {
        const authData = {
          token: data.token,
          user: data.user
        };

        localStorage.setItem('auth', JSON.stringify(authData));
        setAuth(authData);

        if (data.user.role === 'admin') {
          toast.success("Admin logged in successfully!");
          setTimeout(() => navigate('/'), 1500);
        } else {
          toast.success("User logged in successfully!");
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } else {
        toast.error(data.message || "Login Failed");
      }

    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Login Failed";

      setError(message);
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className='login-container my-5'>
        <h4>Login</h4>

        <form onSubmit={handleSubmit}>
          <input
            type='email'
            name='email'
            placeholder='Enter Email'
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Enter Password'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type='submit'>Login</button>
        </form>

        {error && <p className='text-danger'>{error}</p>}

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Login;