import { Clock, MapPin, Phone } from "lucide-react";
import React from "react";
const StoreDetails: React.FC<{ store: any }> = ({ store }) => {
  const totalPrice = store.ingredients.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="p-4 bg-white h-full shadow-inner border-l border-gray-200">
      <h2 className="text-xl font-bold mb-2 text-center">{store.name}</h2>
      <p className="mb-1">{store.description}</p>
      <p className="flex items-center gap-2 mt-4 mb-1 text-gray-700">
        <MapPin className="text-blue-500 w-4 h-4" />
        <span>Địa chỉ: {store.address}</span>
      </p>
      <p className="flex items-center gap-2 mb-1 text-gray-700">
        <Phone className="text-green-500 w-4 h-4" />
        <span>SĐT: {store.phone_number}</span>
      </p>
      <p className="flex items-center gap-2 mb-1 text-gray-700">
        <Clock className="text-black w-4 h-4" />
        <span>
          Giờ mở cửa: {store.openHours} - {store.closeHours}
        </span>
      </p>
      <h3 className="font-semibold mt-4 mb-2">Nguyên liệu:</h3>
      <ul className="text-sm space-y-1">
        {store.ingredients.map((item: any, index: number) => (
          <li key={index} className="flex justify-between">
            <span>{item.title}  x{item.quantity}</span>
            <span>{item.price} đ</span>
          </li>
        ))}
      </ul>


    </div>
  );
};

export default StoreDetails;