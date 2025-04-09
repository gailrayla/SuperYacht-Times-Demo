import React from "react";
import { Input } from "@/components/ui/input";

const PositionsTab = ({
  positions,
  searchQuery,
  setSearchQuery,
}: {
  positions: any[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const filteredPositions = Array.isArray(positions)
    ? positions.filter(
        (position) =>
          position.date_time
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          position.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <h3 className="text-xl font-semibold">Past Positions</h3>
      <Input
        type="text"
        placeholder="Search by date or notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 rounded-md border"
      />
      <ul className="space-y-4">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((position, idx) => (
            <li
              key={position.id || idx}
              className="p-4 border rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            >
              <p>
                <strong>Date:</strong> {position.date_time}
              </p>
              <p>
                <strong>Location:</strong> {position.lat}, {position.lon}
              </p>
              <p>
                <strong>Notes:</strong> {position.notes}
              </p>
            </li>
          ))
        ) : (
          <p>No positions available</p>
        )}
      </ul>
    </div>
  );
};

export default PositionsTab;
