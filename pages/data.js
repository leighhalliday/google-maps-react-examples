import { useState, useCallback, useRef, forwardRef, useEffect } from "react";
import {
  GoogleMapProvider,
  useAutocomplete,
  useGoogleMap,
} from "@ubilabs/google-maps-react-hooks";
import zones from "../data/zones.json";
import colors from "../data/colors";

const MapCanvas = forwardRef((_props, ref) => (
  <div ref={ref} style={{ height: "100vh" }} />
));

const mapOptions = {
  zoom: 10,
  minZoom: 7,
  maxZoom: 13,
  center: {
    lat: 40,
    lng: -88,
  },
  mapId: process.env.NEXT_PUBLIC_MAP_ID,
};

function Data() {
  const [mapContainer, setMapContainer] = useState(null);
  const mapRef = useCallback((node) => setMapContainer(node), []);
  const onLoad = useCallback((map) => addZoneLayer(map), []);

  return (
    <GoogleMapProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
      mapContainer={mapContainer}
      options={mapOptions}
      onLoad={onLoad}
      libraries={["places"]}
      version="beta"
    >
      <AutoComplete />
      <MapCanvas ref={mapRef} />
    </GoogleMapProvider>
  );
}

export default Data;

function addZoneLayer(map) {
  if (map.getMapCapabilities().isDataDrivenStylingAvailable) {
    const featureLayer = map.getFeatureLayer("POSTAL_CODE");

    featureLayer.style = ({ feature }) => {
      const zip = feature.displayName;
      const zone = zones[zip];
      if (!zone) return;

      return {
        fillColor: colors[zone],
        fillOpacity: 0.5,
      };
    };

    const infoWindow = new google.maps.InfoWindow({});

    featureLayer.addListener("click", (event) => {
      const feature = event.features[0];
      if (!feature.placeId) return;
      const zip = feature.displayName;
      const zone = zones[zip];
      if (!zone) return;

      const zoneNumber = zone.replace(/[^0-9]/, "");
      const url = `https://www.gardenia.net/plants/hardiness-zones/${zoneNumber}`;

      infoWindow.setPosition(event.latLng);
      infoWindow.setContent(`
        <div class="info-window">
          <h2>Zone ${zone}</h2>
          <p>ZIP ${zip} is USDA Zone ${zone}.</p>
          <p>
            <a target="_blank" href="${url}">View plants</a> in your zone.
          </p>
        </div>`);
      infoWindow.open({ map });
    });
  }
}

function AutoComplete() {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [position, setPosition] = useState();
  const { map } = useGoogleMap();

  useEffect(() => {
    if (!position || !map) return;
    map.setCenter(position);
    map.setZoom(12);
  }, [map, position]);

  const onPlaceChanged = (place) => {
    if (!place) return;

    setInputValue(place.formatted_address || place.name);
    setPosition({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });

    inputRef.current && inputRef.current.focus();
  };

  useAutocomplete({
    inputField: inputRef && inputRef.current,
    onPlaceChanged,
  });

  return (
    <input
      ref={inputRef}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
    />
  );
}
