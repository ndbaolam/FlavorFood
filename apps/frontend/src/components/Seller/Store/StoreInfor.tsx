import React, { useEffect, useRef, useState } from "react";
import { Store } from "../../../pages/Market/store.interface";
import { PencilRuler } from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { User } from "../../../pages/Profile/Profile.interface";

const StoreInfor: React.FC<{ className?: string; store_id: number; currentUser: User }> = ({ className, store_id,currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [storeData, setStoreData] = useState<Store | null>(null);
    const [openHourInput, setOpenHourInput] = useState("");
    const [closeHourInput, setCloseHourInput] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!store_id) return;
        const fetchStore = async () => {
            try {
                const res = await axiosInstance.get<Store>(`/stores/${store_id}`);
                setStoreData(res.data);
            } catch (error) {
                console.error("Error fetching store:", error);
            }
        };
        fetchStore();
    }, [store_id]);
    

    if (!storeData) return null;

    // Kiểm tra nếu cửa hàng thuộc về người dùng hiện tại
    if (storeData.user.user_id !== currentUser.user_id) {
        return <p>Cửa hàng này không thuộc về bạn.</p>;
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (storeData) {
            setStoreData({ ...storeData, [e.target.name]: e.target.value });
        }
    };

    const handleOpenHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpenHourInput(e.target.value);
        if (storeData) {
            setStoreData({ ...storeData, openHours: e.target.value });
        }
    };

    const handleCloseHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCloseHourInput(e.target.value);
        if (storeData) {
            setStoreData({ ...storeData, closeHours: e.target.value });
        }
    };

    const handleEditToggle = async () => {
        if (isEditing && storeData) {
            try {
                const res = await axiosInstance.patch(`stores/${store_id}`, storeData);
                if (res.data) {
                    setStoreData(res.data);
                    setOpenHourInput(res.data.openHours);
                    setCloseHourInput(res.data.closeHours);
                    toast.success("Cập nhật thành công!", { position: "top-right", autoClose: 2000 });
                }
            } catch (error) {
                console.error("Error updating store:", error);
                toast.error("Cập nhật thất bại!", { autoClose: 2000 });
            }
        }
        setIsEditing(!isEditing);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            });
            const form = new FormData();
            form.append("image", compressedFile);
            const response = await axiosInstance.post('http://localhost:3000/api/upload', form, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 30000,
            });
            const imageUrl = response.data.url;
            setStoreData((prev) => ({
                ...prev!,
                image: imageUrl,
            }));
            toast.success("Tải ảnh thành công!", { autoClose: 2000 });
        } catch (error: any) {
            console.error("Upload error:", error.response?.data || error.message);
            toast.error("Lỗi tải ảnh!", { autoClose: 2000 });
        }
    };

    const inputStyle = `w-full p-3 text-lg border ${isEditing ? "border-black" : "border-gray-300"} rounded-lg bg-gray-100`;

    if (!storeData) return null; 
    return (
        <div className={`border border-white rounded-xl shadow-lg bg-white ${className}`}>
            <div className="p-4">
                <div className="relative mb-8">
                    <img
                        src={storeData?.image || ""}
                        alt="Store Banner"
                        className="w-full h-[200px] object-cover rounded-lg"
                    />
                    {isEditing && (
                        <div className="absolute top-4 right-4">
                            <button
                                className="p-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition bg-white bg-opacity-80"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cập nhật
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    )}
                </div>

                <div className="relative mb-6">
                    <h1 className="text-center font-bold text-2xl">Thông tin cửa hàng</h1>
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center justify-center gap-2 font-bold absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition"
                    >
                        {isEditing ? "Lưu" : <PencilRuler size={20} />}
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-6 pb-6">
                    <div>
                        <label className="block text-lg mb-1 font-bold">Tên cửa hàng</label>
                        <input
                            name="name"
                            className={inputStyle}
                            type="text"
                            value={storeData?.name || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-1 font-bold">Mô tả</label>
                        <textarea
                            className={`${inputStyle} w-full min-h-[100px] resize-none`}
                            name="description"
                            value={storeData?.description || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-1 font-bold">Địa chỉ</label>
                        <input
                            name="address"
                            className={inputStyle}
                            type="text"
                            value={storeData?.address || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-1 font-bold">Số điện thoại</label>
                        <input
                            name="phone_number"
                            className={inputStyle}
                            type="text"
                            value={storeData?.phone_number || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-lg mb-1 font-bold">Giờ mở cửa</label>
                            <input
                                name="openHours"
                                className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                                type="text"
                                value={storeData?.openHours || ""}
                                onChange={handleOpenHourChange}
                                disabled={!isEditing}
                                placeholder="Ví dụ: 08:00"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg mb-1 font-bold">Giờ đóng cửa</label>
                            <input
                                name="closeHours"
                                className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                                type="text"
                                value={storeData?.closeHours || ""}
                                onChange={handleCloseHourChange}
                                disabled={!isEditing}
                                placeholder="Ví dụ: 22:00"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfor;
