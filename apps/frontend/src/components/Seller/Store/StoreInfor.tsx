import React, { useEffect, useRef, useState } from "react";
import { Store } from "../../../pages/Market/store.interface";
import { PencilRuler } from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { User } from "../../../pages/Profile/Profile.interface";

const StoreInfor: React.FC<{ className?: string; store_id: number; currentUser: User }> = ({ className, store_id, currentUser }) => {
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
                setOpenHourInput(new Date(res.data.openHours).toISOString().slice(11, 16));
                setCloseHourInput(new Date(res.data.closeHours).toISOString().slice(11, 16));
            } catch (error) {
                console.error("Error fetching store:", error);
            }
        };
        fetchStore();
    }, [store_id]);


    if (!storeData) return null;

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
                const open = new Date(`2025-01-01T${openHourInput}:00Z`);
                const close = new Date(`2025-01-01T${closeHourInput}:00Z`);

                const payload = {
                    ...storeData,
                    openHours: open.toISOString(),
                    closeHours: close.toISOString(),
                };

                const res = await axiosInstance.patch(`stores/${store_id}`, payload);
                if (res.data) {
                    setStoreData(res.data);
                    setOpenHourInput(new Date(res.data.openHours).toISOString().slice(11, 16));
                    setCloseHourInput(new Date(res.data.closeHours).toISOString().slice(11, 16));
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
            <div className={`m-8 ${className}`}>
                <div className="p-4 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="md:w-1/2 relative">
                            <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden ">
                                <img
                                    src={storeData?.image || ""}
                                    alt="Store Banner"
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>
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

                        <div className="md:w-1/2 w-full relative">
                            <h1 className="text-left font-bold text-2xl mb-4">Thông tin cửa hàng</h1>
                            <button
                                onClick={handleEditToggle}
                                className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition"
                            >
                                {isEditing ? "Lưu" : <PencilRuler size={20} />}
                            </button>
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

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-lg mb-1 font-bold">Giờ mở cửa</label>
                            <input
                                name="openHours"
                                className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                                type="time"
                                value={openHourInput}
                                onChange={handleOpenHourChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg mb-1 font-bold">Giờ đóng cửa</label>
                            <input
                                name="closeHours"
                                className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                                type="time"
                                value={closeHourInput}
                                onChange={handleCloseHourChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
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

                        <div className="flex-1">
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
                    </div>
                </div>
            </div>
    );
};

export default StoreInfor;
