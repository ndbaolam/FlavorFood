import React, { useEffect, useRef, useState } from "react";
import { Store } from "../../../pages/Market/store.interface";
import { PencilRuler, XCircle } from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { User } from "../../../pages/Profile/Profile.interface";

const StoreInfor: React.FC<{ className?: string; store_id: number; currentUser: User }> = ({ className, store_id, currentUser }) => {

    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [storeData, setStoreData] = useState<Store | null>(null);
    const [originalData, setOriginalData] = useState<Store | null>(null);
    const [openHourInput, setOpenHourInput] = useState("");
    const [closeHourInput, setCloseHourInput] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!store_id) return;
        const fetchStore = async () => {
            try {
                const res = await axiosInstance.get<Store>(`/stores/${store_id}`);
                setStoreData(res.data);
                setOriginalData(res.data);
                setOpenHourInput(new Date(res.data.openHours).toISOString().slice(11, 16));
                setCloseHourInput(new Date(res.data.closeHours).toISOString().slice(11, 16));
            } catch (error) {
                console.error("Error fetching store:", error);
            }
        };
        fetchStore();
    }, [store_id]);

    if (!storeData) return null;
    if (!storeData || !storeData.user || storeData.user.user_id !== currentUser.user_id) {
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
                    name: storeData.name,
                    description: storeData.description,
                    address: storeData.address,
                    phone_number: storeData.phone_number,
                    image: storeData.image,
                    openHours: open.toISOString(),
                    closeHours: close.toISOString(),
                };
    
                await axiosInstance.patch(`stores/${store_id}`, payload);
    
                const res = await axiosInstance.get(`/stores/${store_id}`);
                setStoreData(res.data);
                setOriginalData(res.data);
                setOpenHourInput(new Date(res.data.openHours).toISOString().slice(11, 16));
                setCloseHourInput(new Date(res.data.closeHours).toISOString().slice(11, 16));
                toast.success("Cập nhật thành công!", { autoClose: 2000 });
            } catch (error) {
                console.error("Error updating store:", error);
                toast.error("Cập nhật thất bại!", { autoClose: 2000 });
            }
        }
        setIsEditing(!isEditing);
    };
    
    const handleCancelEdit = () => {
        if (originalData) {
            setStoreData(originalData);
            setOpenHourInput(new Date(originalData.openHours).toISOString().slice(11, 16));
            setCloseHourInput(new Date(originalData.closeHours).toISOString().slice(11, 16));
        }
        setIsEditing(false);
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

    return (
        <div className={`m-8 ${className}`}>
            <div className="p-4 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="md:w-1/2 w-full relative">
                        <div className="relative h-[300px] rounded-lg overflow-hidden border border-gray-300">
                            <img
                                src={storeData?.image || ""}
                                alt="Store Banner"
                                className="w-full h-full object-cover"
                            />
                            {isEditing && (
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 px-4 py-1 rounded shadow">
                                    <button
                                        className="text-sm text-blue-600 hover:underline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Cập nhật ảnh
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
                    </div>
                    <div className="md:w-1/2 w-full relative">
                    <h1 className="text-center font-bold text-2xl mb-4 w-full">Thông tin cửa hàng</h1>
                        <div className="absolute top-0 right-0 flex gap-2">

                            <button
                                onClick={handleEditToggle}
                                className="text-blue-600 hover:text-blue-800 px-3 py-1 border-2 border-blue-300 rounded-md"
                                >
                                {isEditing ? "Lưu" : <PencilRuler size={20} />}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-800 px-3 py-1 border-2 border-red-300 rounded-md"
                                >
                                    Huỷ
                                </button>
                            )}
                        </div>

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
