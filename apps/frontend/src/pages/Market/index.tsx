import React, { useEffect, useState, useMemo } from "react";
import getDistance from "geolib/es/getDistance";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from "../../components/Map";
import StoreDetails from "../../components/StoreDetail";
import { Filter, MapPin } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { Store } from "./store.interface";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../utils/auth";
import { formatTime } from "../../utils/fomatDate";
import { User } from "../Profile/Profile.interface";
import { toast } from "react-toastify";
import { flexibleSearch } from "../../utils/vietnameseUtils";
import { useRef } from "react";
import { highlightMatches } from "../../utils/highlightUtils";
import SearchBox from "../../components/Search";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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
  const [selectedStore, setSelectedStore] = useState<StoreWithLocation | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(5);
  const isSellerActive = user?.role === "seller" && user?.status === "active";
  const [showDistanceOptions, setShowDistanceOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("market_searchTerm") || "");

useEffect(() => {
  localStorage.setItem("market_searchTerm", searchTerm);
}, [searchTerm]);
  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getUserProfile();
      setUser(profile);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDistanceOptions(false);
      }
    };

    if (showDistanceOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDistanceOptions]);

  useEffect(() => {
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
              if (!location) return null;
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

        setStores(storesWithData.filter(Boolean));
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

  const filteredStores = useMemo(() => {
    return stores
      .filter(store => store.status === "active")
      .map((store) => {
        const validUserLocation = userLocation != null;
        const validStoreLocation = store.location?.latitude && store.location?.longitude;

        const distance = validUserLocation && validStoreLocation
          ? getDistance(userLocation!, store.location)
          : null;

        return { ...store, distance, id: store.store_id };
      })
      .filter((store) => {
        const fieldsToSearch = [
          store.name || "",
          store.address || "",
          ...(store.ingredients?.map((ingredient) => ingredient.title || "") || [])
        ];

        const matchSearch = flexibleSearch(fieldsToSearch, searchTerm);
        const matchDistance = store.distance === null || store.distance <= distanceFilter * 1000;

        return matchSearch && matchDistance;
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [stores, searchTerm, userLocation, distanceFilter]);

  const handleMapClick = (store: StoreWithLocation) => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(store.address)}`, "_blank");
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu cửa hàng...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className=" text-center mt-8">
        <h2 className="text-4xl font-bold">Khám phá cửa hàng gần bạn</h2>
        <p className="text-gray-600 text-lg mt-1 italic">
          "Tìm nguyên liệu tươi ngon cho bữa ăn hoàn hảo!"
        </p>
      </div>
      <div className="mt-10">
        <div className="flex justify-end mb-4 ">
          {!isSellerActive && (
            <button
              onClick={handleStoreRegistration}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Đăng ký cửa hàng
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row h-screen rounded-lg shadow-md  border-gray-100 border-2">
        <div className="md:w-1/4 w-full h-1/2 md:h-full overflow-y-auto relative">
        <div className="p-2 sticky top-0 z-10 bg-white  flex items-center gap-6">
              <SearchBox
                value={searchTerm}
                onSearch={(val) => {
                  setSearchTerm(val);
                  setSelectedStore(null);
                }}
                isPopupOpen={showDistanceOptions}
                placeholder="Tìm kiếm nguyên liệu/cửa hàng"
                className="text-black min-w-64 pl-10 pr-4 border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
              />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDistanceOptions((prev) => !prev)}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Filter className="w-5 h-5 text-black" />
                </button>

                {showDistanceOptions && (
                  <div className="absolute z-10 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-32">
                    {[5, 10, 15, 20, 25, 30].map((km) => (
                      <div
                        key={km}
                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${distanceFilter === km ? "bg-blue-200 font-semibold" : ""
                          }`}
                        onClick={() => {
                          setDistanceFilter(km);
                          setShowDistanceOptions(false);
                        }}
                      >
                        {km} km
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {userLocation ? (
              <ul>
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => {
                    const isSelected = selectedStore?.store_id === store.store_id;

                    return (
                      <li
                        key={store.store_id}
                        className={`p-2 rounded shadow mb-2 cursor-pointer transition-all duration-200
              ${isSelected ? "bg-gray-300" : "bg-white hover:bg-gray-100"}`}
                        onClick={() => setSelectedStore(store)}
                      >
                        <h3 className="text-black">
                          {highlightMatches(store.name || '', searchTerm)}
                        </h3>
                        <p className="text-black text-sm">
                          {highlightMatches(store.address || '', searchTerm)}
                        </p>
                        <p className="text-black text-sm">
                          Giờ mở cửa: <span className="text-green-500 text-sm">{formatTime(store.openHours)}</span> -{" "}
                          <span className="text-green-500 text-sm">{formatTime(store.closeHours)}</span>
                        </p>
                        {store.distance !== null && (
                          <p className="justify-end flex items-center gap-1 mt-4">
                            <MapPin className="text-blue-400" /> {(store.distance / 1000).toFixed(2)} km
                          </p>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <p>Không có cửa hàng nào phù hợp với yêu cầu tìm kiếm.</p>
                )}
              </ul>
            ) : (
              <p>Đang lấy vị trí của bạn...</p>
            )}

          </div>

          <div className={`h-1/2 md:h-full relative transition-all duration-300 ${selectedStore ? "md:w-2/4" : "md:w-3/4"} w-full`}>
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
            <div className="md:w-1/4 w-full h-full overflow-y-auto ">
              <StoreDetails store={selectedStore} searchTerm={searchTerm} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;