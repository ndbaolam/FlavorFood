import { Clock, MapPin, Phone } from "lucide-react";
import React from "react";
import { formatTime } from "../pages/Market/store.interface";

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi'); 
  return text.replace(regex, (match) => `<span style="color: red; font-weight: bold;">${match}</span>`);  
};

const StoreDetails: React.FC<{ store: any, searchTerm: string }> = ({ store, searchTerm }) => {

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
          Giờ mở cửa: {formatTime(store.openHours)} - {formatTime(store.closeHours)}
        </span>
      </p>
      
      <h3 className="font-semibold mt-4 mb-2">Nguyên liệu:</h3>
      
      <table className="w-full table-auto text-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Tên</th>
            <th className="py-2 px-4 border-b text-left">Số lượng</th>
            <th className="py-2 px-4 border-b text-left">Giá</th>
          </tr>
        </thead>
        <tbody>
          {store.ingredients.map((item: any, index: number) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(item.title, searchTerm),
                  }}
                />
              </td>
              <td className="py-2 px-4">{item.quantity}</td>
              <td className="py-2 px-4">{item.price} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StoreDetails;
