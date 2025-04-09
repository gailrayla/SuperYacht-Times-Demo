import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";

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

interface AddPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  yacht_like_id: number;
  onPositionAdded: () => void;
}

const AddPositionModal: React.FC<AddPositionModalProps> = ({
  isOpen,
  onClose,
  yacht_like_id,
  onPositionAdded,
}) => {
  const [dateTime, setDateTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [latLng, setLatLng] = useState<LatLngTuple | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(
    null
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setLatLng([latitude, longitude]);
      });
    }
  }, []);

  const handleMapClick = (e: any) => {
    setLatLng([e.latlng.lat, e.latlng.lng]);
  };

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleSubmit = async () => {
    if (!latLng || !dateTime || !notes) {
      alert("Please fill all the fields.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Access token not found.");
      return;
    }

    const newPosition = {
      yacht_like_id,
      lat: latLng[0],
      lon: latLng[1],
      date_time: dateTime,
      notes,
    };

    try {
      const response = await fetch(
        `https://api0.superyachtapi.com/api/positions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPosition),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding position:", errorData);
        alert("Failed to add position.");
        return;
      }

      alert("Position added successfully.");
      onPositionAdded();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
          <DialogDescription>
            Set the position on the map and provide the date/time and notes.
          </DialogDescription>
        </DialogHeader>

        <MapContainer
          center={currentLocation || [0, 0]}
          zoom={14}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {latLng && (
            <Marker position={latLng}>
              <Popup>New Position</Popup>
            </Marker>
          )}
          <MapEvents />
        </MapContainer>

        <div className="mt-4">
          <Input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="mb-4 p-2 rounded-md border"
            placeholder="Select date and time"
          />
          <Input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4 p-2 rounded-md border"
            placeholder="Enter notes"
          />
        </div>

        <Button onClick={handleSubmit} className="mt-4 w-full">
          Create Position
        </Button>
        <Button onClick={onClose} className="mt-2 w-full" variant="secondary">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddPositionModal;
