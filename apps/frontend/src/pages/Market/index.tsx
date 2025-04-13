import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [105.854444, 21.028511],
      zoom: 12
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([105.854444, 21.028511])
      .setPopup(new mapboxgl.Popup().setHTML("<h3>Hà Nội</h3><p>Thủ đô Việt Nam</p>"))
      .addTo(map.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current?.setCenter([longitude, latitude]);
          marker.current?.setLngLat([longitude, latitude]);
          marker.current?.setPopup(new mapboxgl.Popup().setHTML("<h3>Vị trí của bạn</h3>"));
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
        }
      );
    } else {
      console.error("");
    }
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
};

const Market: React.FC = () => {
  return (
    <div className="min-h-screen">
        <main className="container mx-auto">

        <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/4 w-full h-1/2 md:h-full p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tìm kiếm cửa hàng</h2>
        <input
          type="text"
          placeholder="Nhập tên nguyên liệu..."
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />    
      </div>

      <div className="md:w-3/4 w-full h-1/2 md:h-full">
        <Map />
      </div>
      </div>
      </main>
    </div>
  );
};

export default Market;