import { Clock, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { formatTime } from "../utils/fomatDate";
import { formatCurrency } from "../utils/fomatPrice";
import { formatQuantity } from "../utils/fomatQuantity";

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, (match) => `<span style="color: red; font-weight: bold;">${match}</span>`);
};

const StoreDetails: React.FC<{ store: any, searchTerm: string }> = ({ store, searchTerm }) => {
  const [imgError, setImgError] = useState(false);

  console.log("store.ingredients:", store.ingredients);

  const toLocalHoursMinutes = (date: Date) => {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  };

  const isStoreOpen = (open: string, close: string) => {
    if (!open || !close) return false;

    const now = new Date();

    const openDate = new Date(open);
    const closeDate = new Date(close);

    if (isNaN(openDate.getTime()) || isNaN(closeDate.getTime())) {
      console.error('Invalid date format');
      return false;
    }

    const { hours: openHour, minutes: openMinute } = toLocalHoursMinutes(openDate);
    const { hours: closeHour, minutes: closeMinute } = toLocalHoursMinutes(closeDate);

    const openTime = new Date(now);
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    if (closeTime <= openTime) {
      return now >= openTime || now <= closeTime;
    } else {
      return now >= openTime && now <= closeTime;
    }
  };

  return (
    <div className="p-4 bg-white h-full shadow-inner border-l border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{store.name}</h2>
        <span
          className={`text-sm font-medium whitespace-nowrap ml-2 ${isStoreOpen(store.openHours, store.closeHours) ? "text-green-600" : "text-red-600"
            }`}
        >
          {isStoreOpen(store.openHours, store.closeHours) ? "Đang mở cửa" : "Đã đóng cửa"}
        </span>
      </div>

      <img
        src={imgError ? '/fallback-image.png' : store.image}
        alt={store.name}
        className="w-full max-w-md h-48 object-cover rounded-lg mb-4"
        onError={() => setImgError(true)}
      />
      <p className="mb-1">{store.description}</p>

      <div className="flex items-center gap-4 mt-4 mb-2 text-black">
        <MapPin className="text-blue-500 w-8 h-8" />
        <span>Địa chỉ: {store.address}</span>
      </div>

      <div className="flex items-center gap-4 mb-2 text-black">
        <Phone className="text-green-500 w-6 h-6" />
        <span>SĐT: {store.phone_number}</span>
      </div>

      <div className="flex items-center gap-4 mb-2 text-black">
        <Clock className="text-black w-6 h-6" />
        <span>
          Giờ mở cửa: {formatTime(store.openHours)} - {formatTime(store.closeHours)}
        </span>
      </div>


      <h3 className="font-semibold text-xl mt-4 mb-2">Nguyên liệu:</h3>

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
              const aMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
              const bMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
              return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
            })
            .map((item: any, index: number) => {
              const isMatch = searchTerm && item.title.toLowerCase().includes(searchTerm.toLowerCase());
              return (
                <tr key={index} className="border-b">
                  <td className={`py-2 px-4 ${isMatch ? 'text-red-600 font-bold' : ''}`}>
                    {item.title}
                  </td>
                  <td className="py-2 px-4">{formatQuantity(item.quantity)}</td>
                  <td className="py-2 px-4">{formatCurrency(item.price)}/{item.unit}</td>
                </tr>
              );
            })}
        </tbody>

      </table>
    </div>
  );
};

export default StoreDetails;
