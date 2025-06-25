import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { User } from "./Profile.interface";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/auth/profile", { withCredentials: true })
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
  console.log("User data:", formData.avatar);

  return (
    <div className="min-h-screen flex justify-center">
      <main className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 p-6">
          <div className="text-center w-full md:w-[300px] flex flex-col items-center">
            <img
              src={formData.avatar || "../../../public/avatar.jpg"}
              alt="User Avatar"
              className="w-[200px] h-[200px] rounded-full object-cover mb-4"
            />
          </div>

          <div className="bg-white p-6 rounded-lg border-2 w-full md:w-[850px] shadow-md">
            <h2 className="text-4xl font-bold mb-5 text-center">Thông tin cá nhân</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xl text-black mb-1">Họ</label>
                <input
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  value={formData.last_name}
                  disabled
                />
              </div>
              <div className="flex-1">
                <label className="block text-xl text-black mb-1">Tên</label>
                <input
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  value={formData.first_name}
                  disabled
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xl  text-black mb-1">Email</label>
              <input
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-gray-100"
                type="text"
                value={formData.mail}
                disabled
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
