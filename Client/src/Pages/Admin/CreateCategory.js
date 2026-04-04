import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import CategoryForm from '../../component/Form/CategoryForm';
import { Modal } from "antd";

function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        // ✅ FIXED URL
        'https://watchecom-backend.onrender.com/api/auth/category/create-category',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = response;

      if (data.success) {
        toast.success("Category created successfully");
        setName('');
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create category');
    }
  };

  const getAllCategory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      if (!token) throw new Error('No token found');

      const { data } = await axios.get(
        // ✅ FIXED URL
        'https://watchecom-backend.onrender.com/api/auth/category/getall-category',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // ✅ FIXED FIELD
        setCategories(data?.categories || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;

      const { data } = await axios.put(
        // ✅ FIXED URL
        `https://watchecom-backend.onrender.com/api/auth/category/update-category/${selected._id}`,
        { name: updatedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Updated");
        setVisible(false);
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;

      const { data } = await axios.delete(
        // ✅ FIXED URL
        `https://watchecom-backend.onrender.com/api/auth/category/delete-category/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Deleted");
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <div className='row'>
        <div className='col-3'>
          <AdminMenu />
        </div>

        <div className='col-9'>
          <h1>Manage Category</h1>

          <div className='p-3 w-50'>
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>

                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setVisible(true);
                        setUpdatedName(c.name);
                        setSelected(c);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleUpdate}
            />
          </Modal>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
}

export default CreateCategory;