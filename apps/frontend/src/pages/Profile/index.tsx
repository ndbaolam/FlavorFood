import React, { useState, useEffect } from "react";
import axiosInstance from '../../services/axiosInstance';
import "./style.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface User {
  user_id: number;
  mail: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: "Norm" | "Admin" | "Seller";
  phone: string;
  address: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/auth/profile")
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleChange = (key: keyof User, value: string) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handleSubmit = () => {
    const token = Cookies.get("token");
    console.log("Token:", token);
    if (formData) {
      axiosInstance
        .put("/user/update", formData)
        .then(() => {
          toast.success("Profile updated successfully!");
          setIsEditing(false);
        })
        .catch((error) => {
          toast.error("Error updating user data");
          console.error(error);
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAvatarUpload = () => {
    if (!selectedFile || !formData) {
      toast.error("Please select a file first!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", selectedFile);
    formDataToSend.append("upload_preset", "itss");

    axiosInstance
      .post("https://api.cloudinary.com/v1_1/dgkfmvxat/image/upload", formDataToSend)
      .then((response) => {
        const avatarUrl = response.data.secure_url;
        axiosInstance
          .put("/user/update", {
            user_id: formData.user_id,
            avatar: avatarUrl,
          })
          .then(() => {
            toast.success("Avatar updated successfully!");
            setFormData({ ...formData, avatar: avatarUrl });
          })
          .catch((error) => {
            console.error("Error updating avatar in the database:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading avatar to Cloudinary:", error);
      });
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="container mx-auto px-4">
        <div className="profile">
          <div className="avatar">
            <img src={formData.avatar} alt="User Avatar" className="avatar-img" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="file-input"
              style={{ display: "none" }}
            />
            <button className="button-update-avatar" onClick={() => document.getElementById("file-input")?.click()}>
              {t("profile.update_avt")}
            </button>
            {selectedFile && (
              <button className="button-upload-avatar" onClick={handleAvatarUpload}>
                {t("profile.upload")}
              </button>
            )}
          </div>
          <div className="form">
            <h2 className="text-center mb-5 font-bold text-lg">{t("profile.your_pro")}</h2>

            <div className="item">
              <input
                className="input"
                placeholder="Email"
                type="text"
                value={formData.mail}
                onChange={(e) => handleChange("mail", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="row">
              <div className="item">
                <input
                  className="input"
                  placeholder="First Name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="item">
                <input
                  className="input"
                  placeholder="Last Name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="item">
              <input
                className="input"
                placeholder="Phone Number"
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="item">
              <input
                className="input"
                placeholder="Address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <button className="button-update-avatar" onClick={isEditing ? handleSubmit : () => setIsEditing(true)}>
              {isEditing ? t("profile.submit") : t("profile.edit")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
