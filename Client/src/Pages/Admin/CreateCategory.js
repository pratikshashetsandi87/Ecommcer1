import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../api"; // ✅ use api.js
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

  // ✅ CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/category/create-category", { name });

      if (data.success) {
        toast.success("Category created");
        setName('');
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Create failed");
    }
  };

  // ✅ GET
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/category/getall-category");

      if (data.success) {
        setCategories(data?.categories || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(
        `/category/update-category/${selected._id}`,
        { name: updatedName }
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

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/category/delete-category/${id}`);

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