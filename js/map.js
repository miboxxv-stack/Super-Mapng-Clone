"use strict";

/*
 * Super-MapNG Leaflet Map
 */

const KAMLOOPS = [50.6745, -120.3273];

let map;
let elevationMap;

let currentLayer;

const layers = {};


/* =========================================================
   BASE MAPS
========================================================= */

function createLayers() {

    layers.osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    );

    layers.dark = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
            maxZoom: 20,
            subdomains: "abcd",
            attribution:
                '&copy; OpenStreetMap contributors &copy; CARTO'
        }
    );

    layers.satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            maxZoom: 19,
            attribution:
                "Tiles &copy; Esri"
        }
    );

    layers.topo = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 17,
            attribution:
                '&copy; OpenStreetMap contributors, SRTM | OpenTopoMap'
        }
    );

}


/* =========================================================
   MAP INITIALIZATION
========================================================= */

function initMap() {

    createLayers();

    map = L.map("map", {
        center: KAMLOOPS,
        zoom: 13,

        zoomControl: true,

        preferCanvas: true
    });

    currentLayer = layers.dark;

    currentLayer.addTo(map);

    addTileSelection();

    addMapEvents();

    initElevationMap();

    updateCoordinates(KAMLOOPS[0], KAMLOOPS[1]);

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    console.log(
        "Super-MapNG Leaflet map initialized."
    );
}


/* =========================================================
   TILE SELECTION
========================================================= */

let tileSelection;

function addTileSelection() {

    /*
     * Approximate 512 x 512 map-generation tile.
     *
     * This is intentionally a Leaflet rectangle,
     * rather than manually creating SVG.
     */

    const center = map.getCenter();

    const size = 0.015;

    tileSelection = L.rectangle(
        [
            [
                center.lat - size / 2,
                center.lng - size / 2
            ],

            [
                center.lat + size / 2,
                center.lng + size / 2
            ]
        ],
        {
            color: "#ff6600",

            weight: 2,

            opacity: 1,

            dashArray: "2 8",

            fillColor: "#ff6600",

            fillOpacity: 0.1,

            interactive: false
        }
    ).addTo(map);
}


/* =========================================================
   MAP EVENTS
========================================================= */

function addMapEvents() {

    map.on(
        "mousemove",
        event => {

            updateCoordinates(
                event.latlng.lat,
                event.latlng.lng
            );

        }
    );

    map.on(
        "move",
        () => {

            if (!tileSelection) return;

            const center = map.getCenter();

            const size = 0.015;

            tileSelection.setBounds(
                [
                    [
                        center.lat - size / 2,
                        center.lng - size / 2
                    ],

                    [
                        center.lat + size / 2,
                        center.lng + size / 2
                    ]
                ]
            );
        }
    );
}


/* =========================================================
   COORDINATES
========================================================= */

function updateCoordinates(lat, lng) {

    const element =
        document.getElementById(
            "map-coordinates"
        );

    if (!element) return;

    element.textContent =
        `Lat: ${lat.toFixed(6)} · Lon: ${lng.toFixed(6)}`;
}


/* =========================================================
   ELEVATION MINI MAP
========================================================= */

function initElevationMap() {

    elevationMap = L.map(
        "elevation-map",
        {
            center: KAMLOOPS,

            zoom: 9,

            zoomControl: false,

            attributionControl: false,

            dragging: false,

            scrollWheelZoom: false,

            doubleClickZoom: false,

            boxZoom: false,

            keyboard: false,

            touchZoom: false
        }
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 12
        }
    ).addTo(elevationMap);

    L.rectangle(
        [
            [
                KAMLOOPS[0] - 0.04,
                KAMLOOPS[1] - 0.06
            ],

            [
                KAMLOOPS[0] + 0.04,
                KAMLOOPS[1] + 0.06
            ]
        ],
        {
            color: "#ff6600",

            weight: 1.5,

            dashArray: "2 8",

            fill: false,

            interactive: false
        }
    ).addTo(elevationMap);
}


/* =========================================================
   MAP LAYER SWITCHING
========================================================= */

function switchLayer(name) {

    if (!layers[name]) return;

    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    currentLayer = layers[name];

    currentLayer.addTo(map);
}


/* =========================================================
   BUTTONS
========================================================= */

document
    .getElementById("map-home")
    ?.addEventListener(
        "click",
        () => {

            map.setView(
                KAMLOOPS,
                13
            );

        }
    );


document
    .getElementById("map-zoom-in")
    ?.addEventListener(
        "click",
        () => {

            map.zoomIn();

        }
    );


document
    .getElementById("map-zoom-out")
    ?.addEventListener(
        "click",
        () => {

            map.zoomOut();

        }
    );


document
    .getElementById("map-locate")
    ?.addEventListener(
        "click",
        () => {

            map.setView(
                KAMLOOPS,
                13
            );

        }
    );


/* =========================================================
   LAYER UI
========================================================= */

document
    .querySelectorAll(
        'input[name="map-layer"]'
    )
    .forEach(
        input => {

            input.addEventListener(
                "change",
                event => {

                    switchLayer(
                        event.target.value
                    );

                }
            );

        }
    );


/* =========================================================
   HIDE ELEVATION
========================================================= */

document
    .getElementById("hide-elevation")
    ?.addEventListener(
        "click",
        () => {

            const panel =
                document.getElementById(
                    "elevation-panel"
                );

            panel.style.display = "none";

        }
    );


/* =========================================================
   SHOW/HIDE TILE
========================================================= */

document
    .getElementById("show-selection")
    ?.addEventListener(
        "change",
        event => {

            if (!tileSelection) return;

            if (event.target.checked) {

                tileSelection.addTo(map);

            } else {

                map.removeLayer(
                    tileSelection
                );

            }

        }
    );


/* =========================================================
   START
========================================================= */

if (
    typeof L !== "undefined"
) {

    initMap();

} else {

    console.error(
        "Leaflet failed to load."
    );

}
