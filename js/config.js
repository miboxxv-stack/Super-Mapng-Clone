// Super MapNG Clone
// Phase 2 configuration

export const CONFIG = {
    appName: "Super MapNG Clone",
    version: "0.2.0",

    // Map generation limits
    limits: {
        previewMax: 1082,
        recommendedMax: 1082,
        warningAbove: 1082,
        hardMax: 4096
    },

    // Default output
    output: {
        width: 512,
        height: 512,
        metersPerPixel: 1.0
    },

    // OSM
    osm: {
        enabled: true,

        // Overpass API
        overpassUrl: "https://overpass-api.de/api/interpreter",

        features: {
            roads: true,
            buildings: true,
            water: true,
            parking: true,
            fences: true,
            barriers: true,
            streetlights: true,
            utilityPoles: true,
            sidewalks: true,
            curbs: true,
            bridges: true,
            trees: true,
            bushes: true
        }
    },

    // Elevation
    elevation: {
        source: "default",
        defaultSource: "30m-global",
        sources: {
            none: "Flat",
            "30m-global": "Global 30m",
            usgs1m: "USGS 1m"
        }
    },

    // Rendering
    rendering: {
        antialias: true,
        shadows: false,
        maxObjectsPreview: 50000,
        maxBuildingsPreview: 5000,
        maxVegetationPreview: 15000
    },

    // BeamNG safety
    beamng: {
        enabled: true,

        // Don't generate huge numbers of individual objects.
        maxBuildings: 3000,
        maxBridges: 100,
        maxRoadSegments: 10000,
        maxVegetation: 15000,
        maxFences: 5000,
        maxStreetlights: 3000,
        maxUtilityPoles: 3000,

        // Above this resolution, automatically reduce object detail.
        highResolutionThreshold: 1082
    },

    // Coordinate defaults
    location: {
        latitude: null,
        longitude: null,
        name: ""
    }
};

export function getResolutionWarning(width, height) {
    const largest = Math.max(width, height);

    if (largest <= 512) {
        return {
            level: "safe",
            message: "512 × 512 is a safe generation size."
        };
    }

    if (largest <= 1082) {
        return {
            level: "safe",
            message: "High-detail generation enabled."
        };
    }

    if (largest <= CONFIG.limits.hardMax) {
        return {
            level: "warning",
            message:
                "Large map selected. Building, bridge and vegetation density will be reduced to protect browser and BeamNG performance."
        };
    }

    return {
        level: "error",
        message:
            `Maximum supported resolution is ${CONFIG.limits.hardMax} × ${CONFIG.limits.hardMax}.`
    };
}
