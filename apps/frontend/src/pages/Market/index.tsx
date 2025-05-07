import React, { useEffect, useState } from "react";
import getDistance from "geolib/es/getDistance";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from "../../components/Map";
import StoreDetails from "../../components/StoreDetail";
import { MapPin } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { Store, Ingredient, formatTime } from "./store.interface";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';

const Market: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get("/stores");
        const storesData = response.data ?? [];

        const storesWithData: Store[] = await Promise.all(
          storesData.map(async (store: Store) => {
            const location = await geocodeAddress(store.address);
            if (!location) return { ...store, location: [0, 0] };

            const res = await axiosInstance.get(`/stores/${store.store_id}`);
            const fullStoreData = res.data;
            const ingredientsData = (fullStoreData.ingredients || []).map((ingredient: any) => ({
              ingredient_id: ingredient.ingredient_id,
              title: ingredient.title,
              price: ingredient.price,
              quantity: ingredient.quantity,
            }));
        
            return {
              ...store,
              location,
              ingredients: ingredientsData,
            };
          })
        );
        setStores(storesWithData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

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

  const filteredStores = stores
    .filter((store) =>
      searchTerm.trim()
        ? store.ingredients?.some((ingredient) =>
            ingredient.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true
    )
    .map((store) => {
      const distance = userLocation && store.location
        ? getDistance(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: store.location[1], longitude: store.location[0] }
          )
        : null;
      return { ...store, distance, id: store.store_id };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  const handleMapClick = (store: Store) => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(store.address)}`, "_blank");
  };

  if (loading) {
    return <div className="p-8">Đang tải dữ liệu cửa hàng...</div>;
  }

  return (
    <div className="min-h-screen p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tìm kiếm cửa hàng</h2>
            <button
              onClick={() => navigate('/store-registration')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Đăng ký cửa hàng
            </button>
          </div>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/4 w-full h-1/2 md:h-full p-4 overflow-y-auto rounded-lg shadow-lg">
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
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <li
                    key={store.store_id}
                    className="p-2 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedStore(store)}
                  >
                    <h3>{store.name}</h3>
                    <p className="text-gray-500">{store.address}</p>
                    <p>
                      Giờ mở cửa: <span className="text-green-300">{formatTime(store.openHours)}</span> -{" "}
                      <span className="text-green-300">{formatTime(store.closeHours)}</span>
                    </p>
                    {store.distance !== null && (
                      <p className="justify-end flex items-center gap-1 mt-4">
                        <MapPin className="text-blue-400" /> {(store.distance / 1000).toFixed(2)} km
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <p>Không có cửa hàng nào phù hợp với yêu cầu tìm kiếm.</p>
              )}
            </ul>
          ) : (
            <p>Đang lấy vị trí của bạn...</p>
          )}
        </div>

        <div
          className={`h-1/2 md:h-full relative transition-all duration-300 ${
            selectedStore ? "md:w-2/4" : "md:w-3/4"
          } w-full`}
        >
          <Map
            stores={stores}
            selectedStore={selectedStore}
            userLocation={userLocation}
            onMapClick={(store) => {
              setSelectedStore(store);
              setSearchTerm("");
              handleMapClick(store); 
            }}
          />
        </div>

        {selectedStore && (
          <div className="md:w-1/4 w-full h-full overflow-y-auto bg-white rounded-lg shadow-lg">
            <StoreDetails store={selectedStore} searchTerm={searchTerm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
