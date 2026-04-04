import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../Layout/AdminMenu";
import moment from "moment";
import { Select } from "antd";
import Layout from "../../Layout/Layout";
import { useAuth } from "../../Context/auth";
import '../../Style/Adminorder.css';

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);

  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      const response = await axios.get(
        // ✅ FIXED URL
        "https://watchecom-backend.onrender.com/api/auth/all-orders",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const response = await axios.put(
        // ✅ FIXED URL
        `https://watchecom-backend.onrender.com/api/auth/order-status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (response.data.success) {
        getOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="orders-container">
        <div className="row dashboard">

          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((o, i) => (
                <div key={o._id}>

                  <table className="orders-table table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{i + 1}</td>

                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o.status}
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>

                        <td>{o.buyer?.name || "No Buyer"}</td>
                        <td>{moment(o.createdAt).fromNow()}</td>
                        <td>{o.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="order-details">
                    {o.products?.map((p) => (
                      <div className="details-content" key={p._id}>

                        {/* ✅ FIXED IMAGE URL */}
                        <img
                          src={`https://watchecom-backend.onrender.com/api/auth/product/getproduct-photo/${p._id}`}
                          alt={p.name}
                        />

                        <div>
                          <p><strong>Name:</strong> {p.name}</p>
                          <p><strong>Description:</strong> {p.description?.substring(0, 30)}</p>
                          <p><strong>Price:</strong> ₹ {p.price}</p>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;