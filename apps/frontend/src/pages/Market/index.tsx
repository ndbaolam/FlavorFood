import React, { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import getDistance from "geolib/es/getDistance";
import Map from "../../components/Map";
import { MapPin } from "lucide-react";
import { Store } from "./store.interface";
import StoreDetails from "../../components/StoreDetail";

const Market: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const storeData: Store[] = [
    {
      store_id: 1,
      name: "Cửa hàng Nguyên Liệu Bếp Xanh",
      location: [105.8411, 21.0245],
      address: "123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội",
      description: "Chuyên cung cấp nguyên liệu tươi ngon cho các món ăn Việt Nam.",
      openHours: "07:00",
      closeHours: "20:00",
      phone: "0123456789",
      ingredients: [
        { food_id: 1, title: "Gạo", quantity: 2, price: 12000, created_at: new Date(), updated_at: new Date() },
        { food_id: 2, title: "Thịt bò", quantity: 1, price: 85000, created_at: new Date(), updated_at: new Date() },
        { food_id: 3, title: "Rau cải", quantity: 3, price: 10000, created_at: new Date(), updated_at: new Date() },
        { food_id: 4, title: "Gia vị", quantity: 1, price: 5000, created_at: new Date(), updated_at: new Date() },
      ],
    },
    {
      store_id: 2,
      name: "Siêu Thị Mini Đồ Nấu",
      location: [105.8585, 21.0321],
      address: "456 Phố Huế, Hai Bà Trưng, Hà Nội",
      description: "Nguyên liệu nhập khẩu và địa phương cho các món Âu Á.",
      openHours: "08:00",
      closeHours: "22:00",
      phone: "0123456789",
      ingredients: [
        { food_id: 5, title: "Mỳ Ý", quantity: 2, price: 30000, created_at: new Date(), updated_at: new Date() },
        { food_id: 6, title: "Sốt cà chua", quantity: 1, price: 15000, created_at: new Date(), updated_at: new Date() },
        { food_id: 7, title: "Phô mai", quantity: 1, price: 40000, created_at: new Date(), updated_at: new Date() },
        { food_id: 8, title: "Tôm", quantity: 1, price: 75000, created_at: new Date(), updated_at: new Date() },
        { food_id: 9, title: "Cá", quantity: 2, price: 65000, created_at: new Date(), updated_at: new Date() },
        { food_id: 10, title: "Mực", quantity: 1, price: 85000, created_at: new Date(), updated_at: new Date() },
        { food_id: 11, title: "Nghêu", quantity: 1, price: 55000, created_at: new Date(), updated_at: new Date() },
        { food_id: 12, title: "Ớt", quantity: 1, price: 5000, created_at: new Date(), updated_at: new Date() },
        { food_id: 13, title: "Tiêu", quantity: 1, price: 10000, created_at: new Date(), updated_at: new Date() },
        { food_id: 14, title: "Tỏi", quantity: 2, price: 7000, created_at: new Date(), updated_at: new Date() },
        { food_id: 15, title: "Gừng", quantity: 1, price: 6000, created_at: new Date(), updated_at: new Date() },
        { food_id: 16, title: "Nước mắm", quantity: 1, price: 12000, created_at: new Date(), updated_at: new Date() },
      ],
    },
    {
      store_id: 3,
      name: "Chợ Nguyên Liệu Hải Sản Tươi Sống",
      location: [105.81978846692725, 21.003867060090716],
      address: "789 Đường Láng, Đống Đa, Hà Nội",
      description: "Chuyên hải sản tươi sống và gia vị đặc biệt.",
      openHours: "05:30",
      closeHours: "18:00",
      phone: "0123456789",
      ingredients: [
        { food_id: 17, title: "Tôm", quantity: 2, price: 80000, created_at: new Date(), updated_at: new Date() },
        { food_id: 18, title: "Cá", quantity: 2, price: 60000, created_at: new Date(), updated_at: new Date() },
        { food_id: 19, title: "Mực", quantity: 1, price: 85000, created_at: new Date(), updated_at: new Date() },
        { food_id: 20, title: "Nghêu", quantity: 1, price: 55000, created_at: new Date(), updated_at: new Date() },
      ],
    },
    {
      store_id: 4,
      name: "Cửa hàng Rau Củ Quả Sạch",
      location: [105.8350, 21.0400],
      address: "10 Đường Hoàng Hoa Thám, Ba Đình, Hà Nội",
      description: "Rau củ quả tươi ngon, đảm bảo an toàn vệ sinh.",
      openHours: "06:00",
      closeHours: "19:00",
      phone: "0123456789",
      ingredients: [
        { food_id: 21, title: "Rau cải", quantity: 2, price: 8000, created_at: new Date(), updated_at: new Date() },
        { food_id: 22, title: "Cà rốt", quantity: 3, price: 10000, created_at: new Date(), updated_at: new Date() },
        { food_id: 23, title: "Khoai tây", quantity: 2, price: 12000, created_at: new Date(), updated_at: new Date() },
        { food_id: 24, title: "Hành tây", quantity: 1, price: 9000, created_at: new Date(), updated_at: new Date() },
      ],
    },
    {
      store_id: 5,
      name: "Tiệm Gia Vị Đặc Sản",
      location: [105.8500, 21.0200],
      address: "20 Đường Tây Sơn, Đống Đa, Hà Nội",
      description: "Gia vị đặc sản từ khắp Việt Nam.",
      openHours: "09:00",
      closeHours: "21:00",
      phone: "0123456789",
      ingredients: [
        { food_id: 25, title: "Ớt", quantity: 1, price: 4000, created_at: new Date(), updated_at: new Date() },
        { food_id: 26, title: "Tiêu", quantity: 1, price: 10000, created_at: new Date(), updated_at: new Date() },
        { food_id: 27, title: "Tỏi", quantity: 2, price: 6000, created_at: new Date(), updated_at: new Date() },
        { food_id: 28, title: "Gừng", quantity: 1, price: 5000, created_at: new Date(), updated_at: new Date() },
        { food_id: 29, title: "Nước mắm", quantity: 1, price: 15000, created_at: new Date(), updated_at: new Date() },
      ],
    },
  ];
  



  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Không thể lấy vị trí người dùng:", error);
      }
    );
  }, []);

  const filteredStores = storeData
    .filter((store) =>
      store.ingredients.some((ingredient) =>
        ingredient.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .map((store) => {
      if (userLocation) {
        const distance = getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: store.location[1], longitude: store.location[0] }
        );
        return { ...store, distance };
      }
      return { ...store, distance: null };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });


  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/4 w-full h-1/2 md:h-full p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Tìm kiếm cửa hàng</h2>
          <input
            type="text"
            placeholder="Nhập tên nguyên liệu..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedStore(null);
            }}
          />
          {userLocation ? (
            <ul>
              {filteredStores.map((store) => (
                <li
                  key={store.store_id}
                  className="p-2 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedStore(store)}
                >
                  <h3>{store.name}</h3>
                  <p className=" text-gray-500">{store.address}</p>
                  <p >
                    Giờ mở cửa: <span className="text-green-300">{store.openHours}</span> - <span className="text-green-300">{store.closeHours}
                    </span>
                  </p>
                  {store.distance !== null && (
                    <p className=" justify-end flex items-center gap-1 mt-4">
                      <MapPin className="text-blue-400 " /> {(store.distance / 1000).toFixed(2)} km
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Đang lấy vị trí của bạn...</p>
          )}
        </div>

        <div
          className={`h-1/2 md:h-full relative transition-all duration-300 ${selectedStore ? "md:w-2/4" : "md:w-3/4"
            } w-full`}
        >
          <Map stores={filteredStores} selectedStore={selectedStore} />
        </div>
        {selectedStore && (
          <div className="md:w-1/4 w-full h-full overflow-y-auto bg-white shadow-inner">
            <StoreDetails store={selectedStore} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;