import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Store } from "../../../pages/Market/store.interface";
import { toast } from "react-toastify";
import { User } from "../../../pages/Profile/Profile.interface";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';
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
  
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      return data.features?.[0]?.geometry?.coordinates ?? null;
    } catch (error) {
      console.error("Geocode error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone_number.trim()) {
      toast.warning("Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }
  
    try {
      setLoading(true);
  
      const location = await geocodeAddress(formData.address);
      if (!location) {
        toast.error("Không thể lấy tọa độ từ địa chỉ.");
        return;
      }
      const [longitude, latitude] = location;
    
  
      const currentDate = new Date().toISOString().split("T")[0];
      const openTime = `${currentDate} ${formData.openHours}:00+00`;
      const closeTime = `${currentDate} ${formData.closeHours}:00+00`;
  
      const payload = {
        ...formData,
        openHours: openTime,
        closeHours: closeTime,
        user_id: currentUser.user_id,
        latitude,
        longitude,
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
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl border border-gray-300 mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Tạo cửa hàng</h2>

      <div className="mb-4">
        <label className="block text-black font-semibold mb-2">Tên cửa hàng *</label>
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
        <label className="block text-black font-semibold mb-2">Địa chỉ *</label>
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
        <label className="block text-black font-semibold mb-2">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black font-semibold mb-2">Số điện thoại *</label>
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
          <label className="block text-black font-semibold mb-2">Giờ mở cửa</label>
          <input
            type="time"
            name="openHours"
            value={formData.openHours}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex-1">
          <label className="block text-black font-semibold mb-2">Giờ đóng cửa</label>
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
        <label className="block text-black font-semibold mb-2">Link ảnh cửa hàng</label>
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
        {loading ? "Đang tạo..." : "Lưu"}
      </button>
    </form>
  );
};

export default CreateStore;
