import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const { Option } = Select;

function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shipping, setShipping] = useState('');
  const [photo, setPhoto] = useState(null);

  // ================= GET CATEGORY =================
  const getAllCategory = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const token = auth?.token;

      const { data } = await axios.get(
        // ✅ FIXED URL
        'https://watchecom-backend.onrender.com/api/auth/category/getall-category',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setCategories(data?.categories || []);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // ================= CREATE PRODUCT =================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const token = auth?.token;

      const productData = new FormData();

      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      productData.append('category', category);
      productData.append('shipping', shipping);

      if (photo) {
        productData.append('photo', photo);
      }

      const slug = slugify(name, { lower: true });
      productData.append('slug', slug);

      const { data } = await axios.post(
        // ✅ FIXED URL
        'https://watchecom-backend.onrender.com/api/auth/product/create-product',
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.success('Product Created Successfully');

        setTimeout(() => {
          navigate('/products');
        }, 800);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1>Create Product</h1>

          <div className="m-1 w-75">

            <Select
              placeholder="Select a category"
              size="large"
              className="form-select mb-3"
              onChange={(value) => setCategory(value)}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo.name : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            {photo && (
              <div className="text-center mb-3">
                <img src={URL.createObjectURL(photo)} alt="preview" height="200" />
              </div>
            )}

            <input
              type="text"
              value={name}
              placeholder="Product Name"
              className="form-control mb-3"
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              value={description}
              placeholder="Description"
              className="form-control mb-3"
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              value={price}
              placeholder="Price"
              className="form-control mb-3"
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              value={quantity}
              placeholder="Quantity"
              className="form-control mb-3"
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Select
              placeholder="Select Shipping"
              size="large"
              className="form-select mb-3"
              onChange={(value) => setShipping(value)}
            >
              <Option value="0">No</Option>
              <Option value="1">Yes</Option>
            </Select>

            <button className="btn btn-primary" onClick={handleCreate}>
              CREATE PRODUCT
            </button>

          </div>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
}

export default CreateProduct;