import { useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

interface MapSearchProps {
  map: MapLibreMap;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapSearch({ map }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results =
        (await response.json()) as SearchResult[];

      if (!results.length) {
        alert("No locations found.");
        return;
      }

      const result = results[0];

      map.flyTo({
        center: [
          Number(result.lon),
          Number(result.lat),
        ],
        zoom: 16,
        pitch: 45,
        duration: 1500,
      });
    } catch (error) {
      console.error(error);
      alert("Unable to search right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search places..."
          style={{
            width: 320,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #555",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </form>
    </div>
  );
}
