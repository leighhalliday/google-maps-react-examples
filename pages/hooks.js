import { useState, useCallback, forwardRef, useEffect, useRef } from "react";
import {
  GoogleMapProvider,
  useGoogleMap,
} from "@ubilabs/google-maps-react-hooks";

/*
1. Render 2 inputs to show useState
2. Log lat/lng to console to show useEffect
3. Add map code (shows useCallback)
4. Store single marker instance with useRef
5. Update Marker's position when lat/lng input changes
*/

const MapCanvas = forwardRef((_props, ref) => (
  <div ref={ref} style={{ height: "100vh" }} />
));

const mapOptions = {
  zoom: 12,
  center: {
    lat: 43.68,
    lng: -79.43,
  },
};

export default function Hooks() {
  const [mapContainer, setMapContainer] = useState(null);
  const mapRef = useCallback((node) => setMapContainer(node), []);

  return (
    <GoogleMapProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
      mapContainer={mapContainer}
      options={mapOptions}
    >
      <MapCanvas ref={mapRef} />
      <Location />
    </GoogleMapProvider>
  );
}

function Location() {
  const [lat, setLat] = useState(43.68);
  const [lng, setLng] = useState(-79.43);
  const markerRef = useRef();
  const { map } = useGoogleMap();

  useEffect(() => {
    if (markerRef.current || !map) return;
    markerRef.current = new google.maps.Marker({ map });
  }, [map]);

  useEffect(() => {
    if (!markerRef.current) return;
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current.setPosition({ lat, lng });
    map.panTo({ lat, lng });
    console.log({ lat, lng });
  }, [lat, lng, map]);

  return (
    <div className="lat-lng">
      <input
        type="number"
        value={lat}
        onChange={(event) => setLat(parseFloat(event.target.value))}
        step="0.01"
      />
      <input
        type="number"
        value={lng}
        onChange={(event) => setLng(parseFloat(event.target.value))}
        step="0.01"
      />
    </div>
  );
}
