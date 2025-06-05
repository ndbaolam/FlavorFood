import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { Store } from "../pages/Market/store.interface";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q";

interface MapProps {
  stores: Store[];
  selectedStore: Store | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onMapClick?: (store: Store) => void;
}

const Map: React.FC<MapProps> = ({
  stores,
  selectedStore,
  userLocation,
  onMapClick,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.854444, 21.028511],
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    stores.forEach((store) => {
      if (
        typeof store.longitude === "number" &&
        typeof store.latitude === "number" &&
        store.latitude >= -90 &&
        store.latitude <= 90 &&
        store.longitude >= -180 &&
        store.longitude <= 180
      ) {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        }).setHTML(
          `<h2><strong>${store.name}</strong></h2><p>${store.address}</p>`
        );
  
        const marker = new mapboxgl.Marker()
          .setLngLat([store.longitude, store.latitude])
          .addTo(map.current!);
  
        const el = marker.getElement();
  
        el.addEventListener("mouseenter", () => {
          popup.addTo(map.current!);
          popup.setLngLat([store.longitude!, store.latitude!]);
        });
  
        el.addEventListener("mouseleave", () => {
          popup.remove();
        });
  
        el.addEventListener("click", () => {
          if (onMapClick) onMapClick(store);
        });
      } else {
        console.warn("Invalid coordinates for store:", store);
      }
    });
  }, [stores, onMapClick]);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    const { latitude, longitude } = userLocation;

    if (
      typeof longitude === "number" &&
      typeof latitude === "number" &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      const userMarker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Vị trí của bạn</strong>"))
        .addTo(map.current);

      return () => {
        userMarker.remove();
      };
    } else {
      console.warn("Invalid user location:", userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (
      selectedStore &&
      map.current &&
      typeof selectedStore.longitude === "number" &&
      typeof selectedStore.latitude === "number" &&
      selectedStore.latitude >= -90 &&
      selectedStore.latitude <= 90 &&
      selectedStore.longitude >= -180 &&
      selectedStore.longitude <= 180
    ) {
      map.current.flyTo({
        center: [selectedStore.longitude, selectedStore.latitude],
        zoom: 15,
        essential: true,
      });
    }
  }, [selectedStore]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
