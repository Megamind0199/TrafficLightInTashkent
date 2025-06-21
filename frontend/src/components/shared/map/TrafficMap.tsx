"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type TrafficLight = {
  _id: string;
  location: {
    start: Coordinates;
    end: Coordinates;
  };
  greenTime: number;
  redTime: number;
  status: "green" | "red";
  lastUpdated: string;
};

// Icon yaratish
const customIcon = L.icon({
  iconUrl:
    "https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
});

const TrafficMap = () => {
  const [lights, setLights] = useState<TrafficLight[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/lights")
      .then((res) => res.json())
      .then((data) => setLights(data))
      .catch((err) => console.error("Ma’lumotlarni olishda xato:", err));
  }, []);

  return (
    <div className="h-[600px] w-full">
      <MapContainer
        center={[41.3111, 69.2797]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full container rounded-xl shadow"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lights.map((light) => (
          <Marker
            key={light._id}
            position={[light.location.start.lat, light.location.start.lng]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <p>
                  <strong>From:</strong> ({light.location.start.lat},{" "}
                  {light.location.start.lng})
                </p>
                <p>
                  <strong>To:</strong> ({light.location.end.lat},{" "}
                  {light.location.end.lng})
                </p>
                <p>
                  🟢 {light.greenTime}s &nbsp; 🔴 {light.redTime}s
                </p>
                <p>Status: {light.status.toUpperCase()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrafficMap;
