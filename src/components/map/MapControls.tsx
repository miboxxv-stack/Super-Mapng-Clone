import { useEffect, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

interface MapControlsProps {
  map: MapLibreMap;
}

export default function MapControls({ map }: MapControlsProps) {
  const [pitch, setPitch] = useState(map.getPitch());

  useEffect(() => {
    const update = () => {
      setPitch(map.getPitch());
    };

    map.on("pitch", update);

    return () => {
      map.off("pitch", update);
    };
  }, [map]);

  const resetNorth = () => {
    map.easeTo({
      bearing: 0,
      duration: 500,
    });
  };

  const tilt3D = () => {
    const newPitch = pitch > 20 ? 0 : 60;

    map.easeTo({
      pitch: newPitch,
      duration: 700,
    });
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [
            position.coords.longitude,
            position.coords.latitude,
          ],
          zoom: 16,
          pitch: 55,
          duration: 1500,
        });
      },
      () => {
        alert("Unable to get your location.");
      }
    );
  };

  return (
    <div
      className="map-controls"
      style={{
        position: "absolute",
        right: 16,
        top: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 20,
      }}
    >
      <button onClick={() => map.zoomIn()}>
        +
      </button>

      <button onClick={() => map.zoomOut()}>
        −
      </button>

      <button onClick={resetNorth}>
        N
      </button>

      <button onClick={tilt3D}>
        3D
      </button>

      <button onClick={locateUser}>
        ◎
      </button>
    </div>
  );
}
