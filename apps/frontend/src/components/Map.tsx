import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaG1pbmhhbmgiLCJhIjoiY205ZmxoNTAwMDgwODJpc2NpaDU0YnI4eSJ9.dOtWi9uma-n7tGP5ngB04Q';


const Map: React.FC<{ stores: any[]; selectedStore: any | null }> = ({
    stores,
    selectedStore,
  }) => {
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
        new mapboxgl.Marker()
          .setLngLat(store.location)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h2>${store.name}</h2><p>${store.address}</p>`
            )
          )
          .addTo(map.current!);
      });
    }, [stores]);
  
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
  