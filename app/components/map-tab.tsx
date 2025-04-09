import { useEffect } from "react";
import dynamic from "next/dynamic";

const MapContainerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const MarkerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const PopupWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

const MapTab = ({ positions }: { positions: any[] }) => {
  if (!Array.isArray(positions) || positions.length === 0) {
    return <div>No positions available</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">Map View</h3>
      <div style={{ height: "400px" }}>
        <MapContainerWithNoSSR
          center={[51.505, -0.09]}
          zoom={2}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayerWithNoSSR url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {positions.map((position, index) => (
            <MarkerWithNoSSR
              key={index}
              position={[parseFloat(position.lat), parseFloat(position.lon)]}
            >
              <PopupWithNoSSR>
                <strong>Date:</strong> {position.date_time}
                <br />
                <strong>Location:</strong> {position.lat}, {position.lon}
              </PopupWithNoSSR>
            </MarkerWithNoSSR>
          ))}
        </MapContainerWithNoSSR>
      </div>
    </div>
  );
};

export default MapTab;
