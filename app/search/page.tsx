"use client";
import { useState } from "react";
import YachtDetailModal from "../components/yacht-detail-modal";
import { fetchYachts } from "../lib/utils/fetchYachts";

const accessToken = "your_access_token_here";

export default function YachtSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYacht, setSelectedYacht] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);

    try {
      const data = await fetchYachts(searchTerm, accessToken);

      setSearchResults(data.yacht_likes || []);
    } catch (error) {
      console.error("Error fetching yachts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (yacht: any) => {
    console.log("Yacht clicked:", yacht);
    setSelectedYacht(yacht);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Yacht Search</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search yachts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-6">
        {searchResults.length === 0 ? (
          <p className="text-center text-gray-600">No yachts found</p>
        ) : (
          <ul className="space-y-4">
            {searchResults.map((yacht: any) => (
              <li
                key={yacht.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-all cursor-pointer"
                onClick={() => handleViewDetails(yacht)}
              >
                <span className="text-xl font-medium text-blue-600 hover:text-blue-800">
                  {yacht.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedYacht && (
        <YachtDetailModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          yacht={selectedYacht}
        />
      )}
    </div>
  );
}
