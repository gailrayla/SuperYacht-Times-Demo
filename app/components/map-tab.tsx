import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";
import { divIcon, LatLngTuple } from "leaflet";

interface Position {
  date_time: string;
  lat: string;
  lon: string;
  notes: string;
}

interface MapTabProps {
  positions: Position[];
  yacht_like_id: number;
}

const MapTab: React.FC<MapTabProps> = ({ yacht_like_id }) => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPositions = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("Access token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api0.superyachtapi.com/api/positions?yacht_like_id=${yacht_like_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching positions:", errorData);
          throw new Error(`Error: ${errorData.message}`);
        }

        const data = await response.json();
        console.log("Fetched positions:", data);
        setPositions(data.positions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (yacht_like_id) {
      fetchPositions();
    }
  }, [yacht_like_id]);

  if (loading) {
    return <p>Loading map...</p>;
  }

  const redDotIcon = divIcon({
    className: "leaflet-div-icon",
    html: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {positions.map((position, idx) => {
        const lat = parseFloat(position.lat);
        const lon = parseFloat(position.lon);
        const latLng: LatLngTuple = [lat, lon];
        return (
          <Marker key={idx} position={latLng} icon={redDotIcon}>
            <Popup>
              <strong>Date:</strong> {position.date_time}
              <br />
              <strong>Location:</strong> {lat}, {lon}
              <br />
              <strong>Notes:</strong> {position.notes}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapTab;
