import { useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

interface MapLayersProps {
  map: MapLibreMap;
}

export default function MapLayers({ map }: MapLayersProps) {
  const [buildings, setBuildings] = useState(true);
  const [terrain, setTerrain] = useState(false);

  const toggleBuildings = () => {
    const visibility = buildings ? "none" : "visible";

    if (map.getLayer("realistic-buildings")) {
      map.setLayoutProperty(
        "realistic-buildings",
        "visibility",
        visibility
      );
    }

    setBuildings(!buildings);
  };

  const toggleTerrain = () => {
    // Terrain source can be added later.
    setTerrain(!terrain);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        zIndex: 20,
        background: "rgba(20,20,20,0.9)",
        borderRadius: 12,
        padding: 12,
        color: "#fff",
      }}
    >
      <strong>Layers</strong>

      <label
        style={{
          display: "block",
          marginTop: 10,
        }}
      >
        <input
          type="checkbox"
          checked={buildings}
          onChange={toggleBuildings}
        />
        {" "}Buildings
      </label>

      <label
        style={{
          display: "block",
          marginTop: 6,
        }}
      >
        <input
          type="checkbox"
          checked={terrain}
          onChange={toggleTerrain}
        />
        {" "}Terrain
      </label>
    </div>
  );
}
