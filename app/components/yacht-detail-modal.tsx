import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PositionsTab from "./positions-tab";
import MapTab from "./map-tab";
import AddPositionModal from "./add-position-modal"; // Import the modal for adding new positions

interface Yacht {
  yacht_like_id: number;
  name: string;
  previous_names: string[];
  build_year: number;
  length_overall: number;
  builder_name: string;
}

interface YachtDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  yacht: Yacht | null;
}

const YachtDetailModal: React.FC<YachtDetailModalProps> = ({
  isOpen,
  onClose,
  yacht,
}) => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);

  useEffect(() => {
    if (yacht?.yacht_like_id) {
      const fetchPositions = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.error("Access token not found.");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://api0.superyachtapi.com/api/positions?yacht_like_id=${yacht.yacht_like_id}`,
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

      fetchPositions();
    }
  }, [yacht]);

  const handlePositionAdded = () => {
    // Callback to refresh the positions list after adding a new position
    if (yacht?.yacht_like_id) {
      const fetchPositions = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token not found.");
          return;
        }
        try {
          const response = await fetch(
            `https://api0.superyachtapi.com/api/positions?yacht_like_id=${yacht.yacht_like_id}`,
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
          setPositions(data.positions || []);
        } catch (error) {
          console.error("Error fetching positions after adding:", error);
        }
      };
      fetchPositions();
    }
  };

  if (!yacht) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{yacht.name}</DialogTitle>
          <DialogDescription>
            <span>
              <strong>Previous Names:</strong> {yacht.previous_names.join(", ")}
            </span>
            <br />
            <span>
              <strong>Build Year:</strong> {yacht.build_year}
            </span>
            <br />
            <span>
              <strong>Length Overall:</strong> {yacht.length_overall} meters
            </span>
            <br />
            <span>
              <strong>Builder:</strong> {yacht.builder_name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <h3 className="text-xl font-semibold">Yacht Details</h3>
            <p>
              <strong>Previous Names:</strong> {yacht.previous_names.join(", ")}
            </p>
            <p>
              <strong>Build Year:</strong> {yacht.build_year}
            </p>
            <p>
              <strong>Length Overall:</strong> {yacht.length_overall} meters
            </p>
            <p>
              <strong>Builder:</strong> {yacht.builder_name}
            </p>
          </TabsContent>

          <TabsContent value="positions">
            {loading ? (
              <p>Loading positions...</p>
            ) : (
              <PositionsTab
                positions={positions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            <Button
              onClick={() => setIsAddPositionModalOpen(true)}
              className="mt-4"
            >
              Add Position
            </Button>
          </TabsContent>

          <TabsContent value="map">
            {loading ? (
              <p>Loading map...</p>
            ) : (
              <MapTab
                yacht_like_id={yacht.yacht_like_id}
                positions={positions}
              />
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={onClose} variant="secondary" className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
      <AddPositionModal
        isOpen={isAddPositionModalOpen}
        onClose={() => setIsAddPositionModalOpen(false)}
        yacht_like_id={yacht.yacht_like_id}
        onPositionAdded={handlePositionAdded}
      />
    </Dialog>
  );
};

export default YachtDetailModal;
