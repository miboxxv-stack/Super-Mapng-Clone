// Super MapNG Clone
// Central application state

import { CONFIG } from "./config.js";

const defaultState = {
    // Application
    ready: false,
    loading: false,
    error: null,

    // Location
    location: {
        name: CONFIG.location.name,
        latitude: CONFIG.location.latitude,
        longitude: CONFIG.location.longitude
    },

    // Map
    map: {
        width: CONFIG.output.width,
        height: CONFIG.output.height,
        metersPerPixel: CONFIG.output.metersPerPixel,

        bounds: null,

        terrainLoaded: false,
        osmLoaded: false,
        satelliteLoaded: false
    },

    // OSM
    osm: {
        loaded: false,
        loading: false,

        roads: [],
        buildings: [],
        water: [],
        parking: [],
        fences: [],
        barriers: [],
        streetlights: [],
        utilityPoles: [],
        sidewalks: [],
        curbs: [],
        bridges: [],
        trees: [],
        bushes: []
    },

    // Generation settings
    generation: {
        includeOSM: true,

        smoothRoads: false,
        levelRoads: true,

        buildings: true,
        bridges: true,
        water: true,
        parking: true,
        fences: true,
        barriers: true,
        streetlights: true,
        utilityPoles: true,
        sidewalks: true,
        curbs: true,
        vegetation: true,

        foundations: false
    },

    // Elevation
    elevation: {
        source: CONFIG.elevation.defaultSource,
        loaded: false,
        min: 0,
        max: 0,
        difference: 0
    },

    // Preview
    preview: {
        active: false,
        objects: 0,
        buildings: 0,
        roads: 0,
        vegetation: 0
    },

    // Export
    export: {
        levelName: "",
        baseTexture: "osm",
        pbrMaterials: "osm",
        roads: "architect",
        biome: "",
        backdrop: "global30m",

        includeBuildings: true,
        includeTrees: true,
        includeRocks: false,
        includeWater: true,

        generated: false
    }
};

let state = structuredClone(defaultState);

const listeners = new Set();

export function getState() {
    return state;
}

export function setState(updates) {
    state = deepMerge(state, updates);

    notify();

    return state;
}

export function resetState() {
    state = structuredClone(defaultState);

    notify();

    return state;
}

export function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function notify() {
    for (const listener of listeners) {
        try {
            listener(state);
        } catch (error) {
            console.error("State listener error:", error);
        }
    }
}

function deepMerge(target, source) {
    const result = structuredClone(target);

    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}

// Convenience functions

export function setLocation(latitude, longitude, name = "") {
    return setState({
        location: {
            latitude,
            longitude,
            name
        }
    });
}

export function setResolution(width, height) {
    return setState({
        map: {
            width,
            height
        }
    });
}

export function setLoading(loading) {
    return setState({
        loading
    });
}

export function setError(error) {
    return setState({
        error
    });
}

export function clearError() {
    return setState({
        error: null
    });
}

export function setOSMData(data) {
    return setState({
        osm: {
            ...data,
            loaded: true,
            loading: false
        },
        map: {
            osmLoaded: true
        }
    });
}

export function setElevationStats(min, max) {
    return setState({
        elevation: {
            loaded: true,
            min,
            max,
            difference: max - min
        }
    });
}
