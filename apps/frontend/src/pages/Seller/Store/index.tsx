import React, { useRef, useState } from "react";
import { Store } from "../../Market/store.interface";

const StoreInfor: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [storeData, setStoreData] = useState<Store>({
        store_id: 1,
        name: "Cửa Hàng Tạp Hóa Minh Anh",
        image: "https://quannho.vn/wp-content/uploads/2023/11/BAG03582-min-scaled.jpg",
        location: [21.0278, 105.8342],
        address: "123 Đường Láng, Đống Đa, Hà Nội",
        description: "Cửa hàng cung cấp nguyên liệu nấu ăn tươi ngon mỗi ngày.",
        openHours: "07:00",
        closeHours: "21:00",
        ingredients: [],
        distance: 2.5,
        phone: "0901 234 567",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreData({ ...storeData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            console.log("Lưu thông tin:", storeData);
        }
        setIsEditing(!isEditing);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setStoreData((prev) => ({
                    ...prev,
                    image: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const inputStyle = `w-full p-3 text-lg border ${isEditing ? "border-black" : "border-gray-300"
        } rounded-lg bg-gray-100`;

    return (
        <div className="mx-auto mt-12 w-full max-w-6xl border border-white rounded-xl shadow-lg bg-white" >
            <div className=" p-4">
                <div className="relative mb-6">
                    <h1 className="text-center  font-bold text-3xl">Thông tin cửa hàng</h1>
                    <button
                        onClick={handleEditToggle}
                        className="font-bold absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-100 transition"

                    >
                        {isEditing ? "Lưu" : "Chỉnh sửa"}
                    </button>
                </div>

                <div className="mt-8 flex flex-col md:flex-row justify-center items-start gap-6 px-6 pb-6">
                    <div className="mt-10 w-full md:w-1/3 flex flex-col items-center gap-2 justify-center">
                        <img
                            src={storeData.image}
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
                        <div>
                            <label className="block text-xl mb-1">Tên cửa hàng</label>
                            <input
                                name="name"
                                className={inputStyle}
                                type="text"
                                value={storeData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Địa chỉ</label>
                                <input
                                    name="address"
                                    className={inputStyle}
                                    type="text"
                                    value={storeData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Số điện thoại</label>
                                <input
                                    name="phone"
                                    className={inputStyle}
                                    type="text"
                                    value={storeData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Giờ mở cửa</label>
                                <input
                                    name="openHours"
                                    className={inputStyle}
                                    type="text"
                                    value={storeData.openHours}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xl mb-1">Giờ đóng cửa</label>
                                <input
                                    name="closeHours"
                                    className={inputStyle}
                                    type="text"
                                    value={storeData.closeHours}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xl mb-1">Mô tả</label>
                            <input
                                name="description"
                                className={inputStyle}
                                type="text"
                                value={storeData.description}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfor;
