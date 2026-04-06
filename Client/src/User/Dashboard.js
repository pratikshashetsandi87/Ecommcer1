import React from 'react';
import Layout from '../Layout/Layout';
import UserMenu from '../Layout/UserMenus';
import { useAuth } from '../Context/auth';

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title="Dashboard">

      <div style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "30px"
      }}>

        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9">

            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              maxWidth: "500px",
              margin: "0 auto"
            }}>

              <h2 style={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: "600"
              }}>
                User Profile
              </h2>

              {/* USER INFO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                <div style={{
                  padding: "10px",
                  background: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <strong>Name:</strong> {auth?.user?.name}
                </div>

                <div style={{
                  padding: "10px",
                  background: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <strong>Email:</strong> {auth?.user?.email}
                </div>

                <div style={{
                  padding: "10px",
                  background: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <strong>Phone:</strong> {auth?.user?.phone}
                </div>

                <div style={{
                  padding: "10px",
                  background: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <strong>Address:</strong> {auth?.user?.address}
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;