import React, { useState, useEffect } from "react";
import UserMenu from "../Layout/UserMenus";
import Layout from "../Layout/Layout";
import { useAuth } from "../Context/auth";
import moment from "moment";
import api from "../api"; // ✅ FIX
import "../Style/order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await api.get("/auth/orders"); // ✅ FIX

      console.log("Orders fetched:", data);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="orders-container container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((o, i) => (
                <div className="order-card border shadow" key={o._id}>
                  
                  <table className="table orders-table">
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
                        <td>{o?.status || "Unknown"}</td>
                        <td>{o?.buyer?.name || "Unknown"}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container">
                    {o?.products?.map((p) => (
                      <div className="order-card d-flex flex-row mb-2 p-3" key={p._id}>
                        
                        {/* ✅ FIXED IMAGE */}
                        <img
                          src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`}
                          alt={p.name}
                        />

                        <div className="card-body">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}...</p>
                          <p>Price: {p.price}</p>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))
            ) : (
              <p>No orders found</p>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;