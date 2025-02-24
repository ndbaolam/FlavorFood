import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import UserSidebar from "../../components/UserSidebar";

interface User {
  user_id: number;
  mail: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: "Norm" | "Admin" | "Seller";
}

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/auth/profile", {
        withCredentials: true, 
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  if (!formData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex  justify-center bg-gray-100">
      <UserSidebar />
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 p-6 h-auto md:h-[500px]">
          {/* Avatar Section */}
          <div className="text-center w-full md:w-[300px] flex flex-col items-center">
            <img
              src={formData.avatar}
              alt="User Avatar"
              className="w-[150px] h-[150px] rounded-full object-cover mb-4"
            />
          </div>

          {/* User Information Section */}
          <div className="text-center bg-white p-6 rounded-lg w-full md:w-[850px] md:h-[500px] shadow-md">
            <h2 className="text-lg font-bold mb-5">
              {"Thông tin cá nhân"}
            </h2>

            <div className="mb-4 relative">
              <input
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                placeholder="Email"
                type="text"
                value={formData.mail}
                disabled
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <input
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                  placeholder="First Name"
                  type="text"
                  value={formData.first_name}
                  disabled
                />
              </div>
              <div className="flex-1 relative">
                <input
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                  placeholder="Last Name"
                  type="text"
                  value={formData.last_name}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
