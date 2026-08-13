import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import MapControls from "./MapControls";
import MapLayers from "./MapLayers";
import MapSearch from "./MapSearch";
import MapContextMenu from "./MapContextMenu";

interface MapViewProps {
  onMapReady?: (map: MapLibreMap) => void;
}

export default function MapView({ onMapReady }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      // Replace this with your own MapLibre-compatible style.
      style: "https://demotiles.maplibre.org/style.json",

      center: [-120.3273, 50.6745], // Kamloops
      zoom: 13,

      pitch: 45,
      bearing: -10,

      maxZoom: 20,
      minZoom: 2,

      attributionControl: true,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      "bottom-right"
    );

    map.on("load", () => {
      onMapReady?.(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onMapReady]);

  return (
    <div className="map-wrapper">
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          width: "100%",
          height: "100vh",
        }}
      />

      {mapRef.current && (
        <>
          <MapControls map={mapRef.current} />
          <MapLayers map={mapRef.current} />
          <MapSearch map={mapRef.current} />
          <MapContextMenu map={mapRef.current} />
        </>
      )}
    </div>
  );
}
