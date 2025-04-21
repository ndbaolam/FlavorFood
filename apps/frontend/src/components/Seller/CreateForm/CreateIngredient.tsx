import { FoodIngredient } from "apps/frontend/src/pages/Seller/Home/foodIngredientinterface";
import { X } from "lucide-react";
import { useState } from "react";

interface CreateIngredientProps {
    initialData?: FoodIngredient;
    onSubmit: (data: FoodIngredient) => void;
    onClose: () => void;
}

const CreateIngredient = ({ initialData, onSubmit, onClose }: CreateIngredientProps) => {
    const [title, setTitle] = useState<string>(initialData?.title || "");
    const [price, setPrice] = useState<number>(initialData?.price || 0);
    const [quantity, setQuantity] = useState<number>(initialData?.quantity || 0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!title.trim()) {
            errors.title = "Tên nguyên liệu không được để trống";
        }
        if (isNaN(price) || price <= 0) {
            errors.price = "Giá phải là số và lớn hơn 0";
        }
        if (isNaN(quantity) || quantity <= 0) {
            errors.quantity = "Số lượng phải là số và lớn hơn 0";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/^0+/, ''); 
        const value = rawValue === '' ? 0 : Number(rawValue);
        setPrice(value);
        setFormErrors(prev => ({ ...prev, price: '' }));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/^0+/, '');
        const value = rawValue === '' ? 0 : Number(rawValue);
        setQuantity(value);
        setFormErrors(prev => ({ ...prev, quantity: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const data: FoodIngredient = {
            food_id: initialData?.food_id || Date.now(),
            title,
            price,
            quantity,
            created_at: new Date(),
            updated_at: new Date(),
        };

        await onSubmit(data);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-2xl overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-grow text-center">
                            <h2 className="text-3xl font-semibold">Tạo nguyên liệu</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const confirmClose = window.confirm("Bạn có chắc chắn muốn tắt không?");
                                if (confirmClose) {
                                    onClose();
                                }
                            }}
                            className="text-red-300 font-bold text-2xl hover:text-red-500"
                        >
                            <X size={36} />
                        </button>
                    </div>
                    <div>
                        <label className="block font-medium">
                            Tên nguyên liệu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded-lg p-2 w-full min-h-[40px]"
                        />
                        {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block font-medium">
                                Giá tiền <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={price === 0 ? '' : price}
                                onChange={handlePriceChange}
                                className="border rounded-lg p-2 w-full min-h-[40px]"
                            />
                            {formErrors.price && <p className="text-red-500">{formErrors.price}</p>}
                        </div>

                        <div>
                            <label className="block font-medium">
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={quantity === 0 ? '' : quantity}
                                onChange={handleQuantityChange}
                                className="border rounded-lg p-2 w-full min-h-[40px]"
                            />
                            {formErrors.quantity && <p className="text-red-500">{formErrors.quantity}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-white bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Đang tạo..." : "Lưu"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateIngredient;
