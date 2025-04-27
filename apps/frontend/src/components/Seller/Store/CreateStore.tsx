import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Store } from "../../../pages/Market/store.interface";
import { toast } from "react-toastify";
import { User } from "../../../pages/Profile/Profile.interface";

interface CreateStoreProps {
  onCreate: (newStore: Store) => void;
  currentUser: User;
}

const CreateStore = ({ onCreate , currentUser}: CreateStoreProps) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    phone_number: "",
    openHours: "07:00",
    closeHours: "21:00",
    image: "", 
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone_number.trim()) {
      toast.warning("Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }
  
    try {
      setLoading(true);
      
      // Chuyển đổi thời gian thành định dạng timestamp
      const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
      const openTime = `${currentDate} ${formData.openHours}:00+00`;  // Thêm thời gian vào ngày hiện tại và múi giờ
      const closeTime = `${currentDate} ${formData.closeHours}:00+00`;  // Thêm thời gian vào ngày hiện tại và múi giờ
  
      const payload = {
        ...formData,
        openHours: openTime,  // Cập nhật openHours thành định dạng timestamp
        closeHours: closeTime,  // Cập nhật closeHours thành định dạng timestamp
        user_id: currentUser.user_id,
      };
  
      const response = await axiosInstance.post("/stores", payload, {
        withCredentials: true,
      });
  
      const createdStore: Store = response.data;
      toast.success("Tạo cửa hàng thành công!");
      onCreate(createdStore);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("Tạo cửa hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Tạo Cửa Hàng Mới</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tên cửa hàng *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Địa chỉ *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Số điện thoại *</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Giờ mở cửa</label>
          <input
            type="time"
            name="openHours"
            value={formData.openHours}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Giờ đóng cửa</label>
          <input
            type="time"
            name="closeHours"
            value={formData.closeHours}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Link ảnh cửa hàng</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Nhập URL ảnh cửa hàng"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-4 w-full h-48 object-cover rounded-lg border"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {loading ? "Đang tạo..." : "Tạo cửa hàng"}
      </button>
    </form>
  );
};

export default CreateStore;
