import { useState, useCallback, forwardRef } from "react";
import { GoogleMapProvider } from "@ubilabs/google-maps-react-hooks";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import SuperClusterAlgorithm from "../utils/superClusterAlgorithm";
import trees from "../data/trees.json";

const MapCanvas = forwardRef((_props, ref) => (
  <div ref={ref} style={{ height: "100vh" }} />
));

const mapOptions = {
  zoom: 12,
  center: {
    lat: 43.682,
    lng: -79.431,
  },
};

function Cluster() {
  const [mapContainer, setMapContainer] = useState(null);
  const mapRef = useCallback((node) => setMapContainer(node), []);
  const onLoad = useCallback((map) => addMarkers(map), []);

  return (
    <GoogleMapProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
      mapContainer={mapContainer}
      options={mapOptions}
      onLoad={onLoad}
    >
      <MapCanvas ref={mapRef} />
    </GoogleMapProvider>
  );
}

export default Cluster;

function addMarkers(map) {
  const infoWindow = new google.maps.InfoWindow({});

  const markers = trees.map(([name, lat, lng]) => {
    const marker = new google.maps.Marker({
      position: { lat, lng },
    });

    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent(`
        <div class="info-window">
          <h2>${name}</h2>
        </div>`);
      infoWindow.open({ map });
    });

    return marker;
  });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 200 }),
  });
}
