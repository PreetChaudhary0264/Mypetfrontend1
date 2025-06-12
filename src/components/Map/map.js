import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./Map.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const petStoreIcon = new L.DivIcon({
  html: "🏪",
  className: "custom-icon",
  iconSize: [24, 24],
});

const vetIcon = new L.DivIcon({
  html: "🐶",
  className: "custom-icon",
  iconSize: [24, 24],
});

const LocationMarker = ({ onLocation }) => {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = [pos.coords.latitude, pos.coords.longitude];
        map.setView(userPos, 14);
        onLocation(userPos);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, [map, onLocation]);

  return null;
};

const RoutingControl = ({ from, to }) => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map || !from) return;

    if (!controlRef.current) {
      // Create routing control once
      controlRef.current = L.Routing.control({
        waypoints: [],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        createMarker: () => null,
      }).addTo(map);
    }

    const control = controlRef.current;

    if (from && to) {
      control.setWaypoints([L.latLng(...from), L.latLng(...to)]);
    } else if (from && !to) {
      // Clear the destination
      control.setWaypoints([]);
    }

    return () => {
      // Keep the control; do not remove it abruptly
      control.setWaypoints([]);
    };
  }, [from, to, map]);

  return null;
};



const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filters, setFilters] = useState({ petStore: true, veterinary: true });
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (!userLocation) return;

    const [lat, lon] = userLocation;
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="pet"](around:3000,${lat},${lon});
        node["amenity"="veterinary"](around:3000,${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    axios
      .post("https://overpass-api.de/api/interpreter", query, {
        headers: { "Content-Type": "text/plain" },
      })
      .then((response) => {
        setPlaces(response.data.elements);
      })
      .catch((err) => {
        console.error("Overpass API error:", err);
      });
  }, [userLocation]);

  const handleFilterChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <>
    <div className="map-container">
      <div className="filter-toggle-group">
         <button
         className={filters.petStore ? "filter-btn active" : "filter-btn"}
         onClick={() => handleFilterChange("petStore")}
         >
         🏪 Pet Stores
         </button>
         <button
              className={filters.veterinary ? "filter-btn active" : "filter-btn"}
                onClick={() => handleFilterChange("veterinary")}
              >
          🐶 Vet Clinics
         </button>
      </div>


      <MapContainer center={[20, 78]} zoom={5} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocation={setUserLocation} />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {places.map((place) => {
          const isPetStore = place.tags?.shop === "pet";
          const isVet = place.tags?.amenity === "veterinary";

          if (
            (isPetStore && filters.petStore) ||
            (isVet && filters.veterinary)
          ) {
            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lon]}
                icon={isPetStore ? petStoreIcon : vetIcon}
                eventHandlers={{
                  click: () => setDestination([place.lat, place.lon]),
                }}
              >
                <Popup>
                   {place.tags?.name || "Unnamed"} <br />
                   {isPetStore ? "Pet Store 🏪" : "Veterinary Clinic 🐶"}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}

        {userLocation && destination && (
          <RoutingControl from={userLocation} to={destination} />
        )}
      </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;










