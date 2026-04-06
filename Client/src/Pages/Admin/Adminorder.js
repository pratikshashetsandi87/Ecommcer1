import React, { useState, useEffect } from "react";
import AdminMenu from "../../Layout/AdminMenu";
import moment from "moment";
import { Select } from "antd";
import Layout from "../../Layout/Layout";
import { useAuth } from "../../Context/auth";
import api from "../../api"; // ✅ FIX

const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);

  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  // ================= GET ORDERS =================
  const getOrders = async () => {
    try {
      const { data } = await api.get("/auth/all-orders"); // ✅ FIX
      setOrders(data?.orders || []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // ================= UPDATE STATUS =================
  const handleChange = async (orderId, value) => {
    try {
      const { data } = await api.put(
        `/auth/order-status/${orderId}`, // ✅ FIX
        { status: value }
      );

      if (data.success) getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Orders"}>
      <div
        style={{
          padding: "20px",
          background: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              All Orders
            </h2>

            {orders.length === 0 ? (
              <p style={{ textAlign: "center" }}>No Orders Found</p>
            ) : (
              orders.map((o, i) => (
                <div
                  key={o._id}
                  style={{
                    background: "#fff",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* TABLE */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Qty</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{i + 1}</td>

                        <td>
                          <Select
                            bordered={false}
                            defaultValue={o.status}
                            onChange={(value) =>
                              handleChange(o._id, value)
                            }
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>

                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>
                          {o?.payment?.success ? "Success" : "Failed"}
                        </td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* PRODUCTS */}
                  <div>
                    {o?.products?.map((p) => (
                      <div
                        key={p._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          background: "#f9f9f9",
                          padding: "10px",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {/* IMAGE */}
                        <img
                          src={`https://watchecom-backend.onrender.com/api/product/getproduct-photo/${p._id}`}
                          alt={p.name}
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            background: "#fff",
                          }}
                        />

                        {/* DETAILS */}
                        <div>
                          <p>
                            <strong>{p.name}</strong>
                          </p>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#666",
                            }}
                          >
                            {p.description?.substring(0, 30)}...
                          </p>
                          <p style={{ color: "green" }}>
                            ₹ {p.price}
                          </p>
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
