import React, { useEffect, useState } from "react";
import getDistance from "geolib/es/getDistance";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from "../../components/Map";
import StoreDetails from "../../components/StoreDetail";
import { MapPin } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { Store} from "./store.interface";
import { useNavigate } from "react-router-dom";
import { checkAuth, getUserProfile } from "../../utils/auth";
import { formatTime } from "../../utils/fomatDate";
import { User } from "../Profile/Profile.interface";
import { toast } from "react-toastify";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';

interface Location {
  latitude: number;
  longitude: number;
}

interface StoreWithLocation extends Store {
  location: Location;
  distance?: number | null;
}

const Market: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreWithLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreWithLocation | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getUserProfile();
      setUser(profile);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);
  const isSellerActive = user?.role === "seller" && user?.status === "active";


  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getUserProfile();
      setUser(profile);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  const handleStoreRegistration = () => {
    if (user) {
      navigate('/store-registration');
    } else {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
        position: "top-right",
        autoClose: 2000
      });
      navigate('/sign-in', { state: { returnTo: '/store-registration' } });
      return;
    }
  };

  const geocodeAddress = async (address: string): Promise<Location | null> => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;
        return { latitude, longitude };
      }
      return null;
    } catch (error) {
      console.error("Geocode error:", error);
      return null;
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get("/stores");
      const storesData = response.data ?? [];

      const storesWithData: StoreWithLocation[] = await Promise.all(
        storesData.map(async (store: Store) => {
          let location: Location | null = null;
          if (
            typeof store.latitude === "number" &&
            typeof store.longitude === "number" &&
            !isNaN(store.latitude) &&
            !isNaN(store.longitude)
          ) {
            location = {
              latitude: store.latitude,
              longitude: store.longitude,
            };
          } else {

            location = await geocodeAddress(store.address);
          }
          if (!location) {
            location = { latitude: 0, longitude: 0 };
          }

          const res = await axiosInstance.get(`/stores/${store.store_id}`);
          const fullStoreData = res.data;
          const ingredientsData = (fullStoreData.ingredients || []).map((ingredient: any) => ({
            ingredient_id: ingredient.ingredient_id,
            title: ingredient.title,
            price: ingredient.price,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
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
  useEffect(() => {
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
    .filter((store) => {
      if (!searchTerm.trim()) return true;

      const lowerSearch = searchTerm.toLowerCase();
      const matchesIngredient = store.ingredients?.some((ingredient) =>
        ingredient.title?.toLowerCase().includes(lowerSearch)
      );
      const matchesStoreName = store.name?.toLowerCase().includes(lowerSearch);

      return matchesIngredient || matchesStoreName;
    })
    .map((store) => {
      const validUserLocation = userLocation != null;
      const validStoreLocation = store.location && store.location.latitude != null && store.location.longitude != null;

      const distance = validUserLocation && validStoreLocation
        ? getDistance(userLocation!, store.location)
        : null;

      return { ...store, distance, id: store.store_id };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  const handleMapClick = (store: StoreWithLocation) => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(store.address)}`, "_blank");
  };

  if (loading) {
    return <div className="p-8">Đang tải dữ liệu cửa hàng...</div>;
  }

  return (
    <div className="min-h-screen p-8 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center">Tìm kiếm nguyên liệu, cửa hàng</h2>
        {!isSellerActive && (
          <button
            onClick={handleStoreRegistration}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Đăng ký cửa hàng
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/4 w-full h-1/2 md:h-full p-4 overflow-y-auto rounded-lg shadow-lg">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Nhập tên nguyên liệu / tên cửa hàng..."
              className="w-full p-2 border-2 border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedStore(null);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStore(null);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl hover:text-red-500 focus:outline-none"
              >
                ×
              </button>
            )}
          </div>

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
                    <p className="text-black text-sm">{store.address}</p>
                    <p className="text-black text-sm">
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
          className={`h-1/2 md:h-full relative transition-all duration-300 ${selectedStore ? "md:w-2/4" : "md:w-3/4"
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