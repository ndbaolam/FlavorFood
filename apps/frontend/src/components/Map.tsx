import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { Store } from "../pages/Market/store.interface";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';

interface MapProps {
  stores: Store[];
  selectedStore: Store | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onMapClick?: (store: Store) => void;
}

const Map: React.FC<MapProps> = ({ stores, selectedStore, userLocation, onMapClick }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [105.854444, 21.028511], 
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
  
    stores.forEach((store) => {
      if (store.location) {
        const marker = new mapboxgl.Marker()
          .setLngLat(store.location)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h2>${store.name}</h2><p>${store.address}</p>`
            )
          )
          .addTo(map.current!);

        // Gọi hàm onMapClick khi bấm vào marker
        marker.getElement().addEventListener("click", () => {
          if (onMapClick) onMapClick(store); 
        });
      }
    });
  }, [stores, onMapClick]);
  
  useEffect(() => {
    if (!map.current || !userLocation) return;
    const userMarker = new mapboxgl.Marker({ color: "blue" }) 
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new mapboxgl.Popup().setHTML("<strong>Vị trí của bạn</strong>"))
      .addTo(map.current);
    return () => {
      userMarker.remove();
    };
  }, [userLocation]);

  useEffect(() => {
    if (selectedStore && map.current) {
      map.current.flyTo({
        center: selectedStore.location,
        zoom: 15,
        essential: true,
      });
    }
  }, [selectedStore]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
