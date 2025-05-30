import { TipsItem } from "apps/frontend/src/pages/Tips/tip.interface";
import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from 'react-toastify'; 
import { TextEditor } from '../../TextEditor'

interface TipDetailPopupProps {
    initialData?: TipsItem;
    onClose: () => void;
    onSubmit: (data: TipsItem) => void;
    isEditing?: boolean;
}

const CreateTip: React.FC<TipDetailPopupProps> = ({ initialData, onClose, onSubmit, isEditing }) => {
    const [title, setTitle] = useState<string>(initialData?.title || "");
    const [thumbnail, setThumbnail] = useState<string | null>(initialData?.thumbnail || null);
    const [content, setContent] = useState<string>(initialData?.content || "");
    const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        let errors: { [key: string]: string } = {};
        if (!title.trim()) {
            errors.title = "Tên mẹo vặt là bắt buộc.";
        }
        if (!content.trim()) {
            errors.content = "Nội dung là bắt buộc.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log(content)
        if (validateForm()) {
            const newTip: TipsItem = {
                tip_id: initialData?.tip_id || 0,
                title,
                thumbnail: thumbnail || "",
                content,
                genres: initialData?.genres || [],
                createdAt: initialData?.createdAt ? new Date(initialData.createdAt) : new Date(),
                updatedAt: new Date(),
            };

            onSubmit(newTip);
            if (isEditing) {
                toast.success("Đã sửa mẹo vặt thành công!");
            } else {
                toast.success("Đã tạo mẹo vặt thành công!");
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50  ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-4xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex-grow text-center">
                        <h2 className="text-3xl font-semibold text-black">{isEditing ? "Sửa mẹo vặt" : "Tạo mẹo vặt"}</h2>
                    </div>
                    <button onClick={onClose} className="text-black font-bold text-2xl">
                        <X size={36} />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4">

                    <div className="mb-4">
                        <label className="block  font-medium ">Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {formErrors.title && <p className="text-red-500 text-xs italic">{formErrors.title}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium">Hình ảnh</label>
                        <div className="flex space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    value="url"
                                    checked={imageInputType === "url"}
                                    onChange={() => setImageInputType("url")}
                                />
                                URL
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="file"
                                    checked={imageInputType === "file"}
                                    onChange={() => setImageInputType("file")}
                                />
                                Tải ảnh lên
                            </label>
                        </div>
                        {imageInputType === "url" ? (
                            <input
                                type="text"
                                value={thumbnail ?? ""}
                                onChange={(e) => setThumbnail(e.target.value)}
                                className="border rounded-lg p-2 w-full min-h-[40px] mt-2"
                                placeholder="Nhập URL hình ảnh"
                            />
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="border rounded-lg p-2 w-full min-h-[40px] mt-2"
                            />
                        )}
                        {formErrors.image && <p className="text-red-500">{formErrors.image}</p>}
                        {thumbnail && <img src={thumbnail} alt="Preview" className="mt-2 max-w-full max-h-40" />}
                    </div>

                    <div className="mb-4">
                        <label className="block  font-medium ">Nội dung</label>
                        <TextEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={handleSubmit} className="text-white bg-blue-600 px-4 py-2 rounded-lg">
                        {isEditing ? 'Cập nhật' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTip;