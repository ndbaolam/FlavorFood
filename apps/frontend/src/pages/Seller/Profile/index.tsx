import React, { useEffect, useRef, useState } from "react";
import { User } from "../../Profile/Profile.interface";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerProfile: React.FC = () => {
    const [formData, setFormData] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                await axiosInstance.put(`/users/${formData?.user_id}`, formData, {
                    withCredentials: true,
                });
                toast("Cập nhật thành công", {
                    position: "top-right",
                    autoClose: 2000,
                });
    
            } catch (error) {
            }
        }
        setIsEditing(!isEditing);
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev!,
                    image: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev!,
            [e.target.name]: e.target.value,
        }));
    };

    const inputStyle = `w-full p-3 text-lg border ${isEditing ? "border-black" : "border-gray-300"
        } rounded-lg bg-gray-100`;

    return (
        <div className="mx-auto mt-12 w-full max-w-6xl border border-white rounded-xl shadow-lg bg-white" >
            <div className=" p-4">
                <div className="relative mb-6">
                    <h1 className="text-center  font-bold text-3xl">Thông tin tài khoản</h1>
                    <button
                        onClick={handleEditToggle}
                        className="font-bold absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition"

                    >
                        {isEditing ? "Lưu" : "Cập nhật"}
                    </button>
                </div>

                <div className="mt-8 flex flex-col md:flex-row justify-center items-start gap-6 px-6 pb-6">
                    <div className="mt-10 w-full md:w-1/3 flex flex-col items-center gap-2 justify-center">
                        <img
                            src={formData.avatar || "../../avatar.jpg"}
                            alt="Store"
                            className="w-[180px] h-[180px] rounded-full object-cover"
                        />
                        {isEditing && (
                            <>
                                <button
                                    className="mt-4 px-4 py-2 font-bold border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Chỉnh sửa ảnh
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>


                    <div className="w-full md:w-2/3 flex flex-col gap-4 p-8">
                    <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Họ</label>
                                <input
                                    name="first_name" 
                                    className={inputStyle}
                                    type="text"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Tên</label>
                                <input
                                    name="last_name"
                                    className={inputStyle}
                                    type="text"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xl mb-1">Email</label>
                            <input
                                name="mail"
                                className={inputStyle}
                                type="text"
                                value={formData.mail}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SellerProfile;