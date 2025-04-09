import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PositionsTab from "./positions-tab";
import MapTab from "./map-tab";

const YachtDetailModal = ({ isOpen, onClose, yacht }: any) => {
  const [positions, setPositions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (yacht?.yacht_like_id) {
      const fetchPositions = async () => {
        const response = await fetch(
          `https://api0.superyachtapi.com/api/positions?yacht_like_id=${yacht.yacht_like_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer your_access_token_here`,
            },
          }
        );
        const data = await response.json();
        console.log("Fetched positions:", data); // Add this log
        setPositions(data);
      };

      fetchPositions();
    }
  }, [yacht]);

  if (!yacht) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-4 w-full">
          View Details
        </Button>
      </DialogTrigger>

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
            <PositionsTab
              positions={positions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="map">
            <MapTab positions={positions} />
          </TabsContent>
        </Tabs>

        <Button onClick={onClose} variant="secondary" className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default YachtDetailModal;
