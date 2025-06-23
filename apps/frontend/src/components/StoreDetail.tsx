import { Clock, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { formatTime } from "../utils/fomatDate";
import { formatCurrency } from "../utils/fomatPrice";
import { formatQuantity } from "../utils/fomatQuantity";
import { removeVietnameseTones } from "../utils/vietnameseUtils";

const highlightSearchTerm = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm) return text;

  const normalizedText = removeVietnameseTones(text).toLowerCase();
  const normalizedSearch = removeVietnameseTones(searchTerm).toLowerCase();

  if (normalizedText.includes(normalizedSearch)) {
    return <span className="text-red-600 font-bold">{text}</span>;
  }

  return text;
};

const StoreDetails: React.FC<{ store: any, searchTerm: string }> = ({ store, searchTerm }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{store.name}</h2>
      </div>
      <img
        src={imgError ? '/fallback-image.png' : store.image}
        alt={store.name}
        className="w-full max-w-md h-48 object-cover rounded-lg mb-4"
        onError={() => setImgError(true)}
      />
      <p className="mb-1">{store.description}</p>

      <div className="flex items-center gap-4 mt-4 mb-2 text-black">
        <MapPin className="text-blue-500 w-12 h-12" />
        <span>Địa chỉ: {store.address}</span>
      </div>

      <div className="flex items-center gap-4 mb-2 text-black">
        <Phone className="text-green-500 w-5 h-5" />
        <span>SĐT: {store.phone_number}</span>
      </div>

      <div className="flex items-center gap-4 mb-2 text-black">
        <Clock className="text-black w-5 h-5" />
        <span>
          Giờ mở cửa: {formatTime(store.openHours)} - {formatTime(store.closeHours)}
        </span>
      </div>

      <h3 className="font-semibold text-xl mt-4 mb-2">Nguyên liệu</h3>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Tên</th>
            <th className="py-2 px-4 border-b text-left">Số lượng</th>
            <th className="py-2 px-4 border-b text-left">Giá</th>
          </tr>
        </thead>
        <tbody>
          {store.ingredients
            .slice()
            .sort((a: any, b: any) => {
              const normalizedSearch = removeVietnameseTones(searchTerm).toLowerCase();
              const aMatch = removeVietnameseTones(a.title).toLowerCase().includes(normalizedSearch);
              const bMatch = removeVietnameseTones(b.title).toLowerCase().includes(normalizedSearch);
              return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
            })
            .map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">
                  {highlightSearchTerm(item.title, searchTerm)}
                </td>
                <td className="py-2 px-4">{formatQuantity(item.quantity)}</td>
                <td className="py-2 px-4">{formatCurrency(item.price)}/{item.unit}</td>
              </tr>
            ))}
        </tbody>

      </table>
    </div>
  );
};

export default StoreDetails;
