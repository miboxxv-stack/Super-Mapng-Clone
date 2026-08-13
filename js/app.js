// Super MapNG Clone
// Main application controller

import {
    getState,
    setState,
    subscribe,
    setLocation,
    setResolution,
    setLoading,
    setError,
    clearError
} from "./state.js";

import {
    CONFIG,
    getResolutionWarning
} from "./config.js";

class SuperMapNG {
    constructor() {
        this.state = getState();

        this.elements = {};

        this.init();
    }

    init() {
        this.cacheElements();

        this.bindEvents();

        subscribe((state) => {
            this.state = state;
            this.updateUI();
        });

        this.updateUI();

        console.log(
            `${CONFIG.appName} v${CONFIG.version} initialized`
        );
    }

    cacheElements() {
        this.elements = {
            latitude:
                document.querySelector("#latitude"),

            longitude:
                document.querySelector("#longitude"),

            locationSearch:
                document.querySelector("#location-search"),

            resolution:
                document.querySelector("#resolution"),

            metersPerPixel:
                document.querySelector("#meters-per-pixel"),

            previewButton:
                document.querySelector("#preview-3d"),

            generateButton:
                document.querySelector("#generate-data"),

            exportButton:
                document.querySelector("#beamng-export"),

            osmCheckbox:
                document.querySelector("#include-osm"),

            smoothRoads:
                document.querySelector("#smooth-roads"),

            levelRoads:
                document.querySelector("#level-roads"),

            buildings:
                document.querySelector("#include-buildings"),

            bridges:
                document.querySelector("#include-bridges"),

            water:
                document.querySelector("#include-water"),

            parking:
                document.querySelector("#include-parking"),

            fences:
                document.querySelector("#include-fences"),

            streetlights:
                document.querySelector("#include-streetlights"),

            utilityPoles:
                document.querySelector("#include-utility-poles")
        };
    }

    bindEvents() {
        const e = this.elements;

        if (e.latitude && e.longitude) {
            e.latitude.addEventListener("change", () => {
                this.updateCoordinates();
            });

            e.longitude.addEventListener("change", () => {
                this.updateCoordinates();
            });
        }

        if (e.resolution) {
            e.resolution.addEventListener("change", () => {
                const size = Number(e.resolution.value);

                setResolution(size, size);

                this.checkResolution(size, size);
            });
        }

        if (e.metersPerPixel) {
            e.metersPerPixel.addEventListener("change", () => {
                const value = Number(
                    e.metersPerPixel.value
                );

                if (!Number.isFinite(value) || value <= 0) {
                    setError(
                        "Meters per pixel must be greater than 0."
                    );

                    return;
                }

                setState({
                    map: {
                        metersPerPixel: value
                    }
                });

                clearError();
            });
        }

        if (e.previewButton) {
            e.previewButton.addEventListener(
                "click",
                () => this.preview3D()
            );
        }

        if (e.generateButton) {
            e.generateButton.addEventListener(
                "click",
                () => this.generateData()
            );
        }

        if (e.exportButton) {
            e.exportButton.addEventListener(
                "click",
                () => this.exportBeamNG()
            );
        }

        this.bindFeatureCheckbox(
            e.osmCheckbox,
            "includeOSM"
        );

        this.bindFeatureCheckbox(
            e.smoothRoads,
            "smoothRoads"
        );

        this.bindFeatureCheckbox(
            e.levelRoads,
            "levelRoads"
        );

        this.bindFeatureCheckbox(
            e.buildings,
            "buildings"
        );

        this.bindFeatureCheckbox(
            e.bridges,
            "bridges"
        );

        this.bindFeatureCheckbox(
            e.water,
            "water"
        );

        this.bindFeatureCheckbox(
            e.parking,
            "parking"
        );

        this.bindFeatureCheckbox(
            e.fences,
            "fences"
        );

        this.bindFeatureCheckbox(
            e.streetlights,
            "streetlights"
        );

        this.bindFeatureCheckbox(
            e.utilityPoles,
            "utilityPoles"
        );
    }

    bindFeatureCheckbox(element, property) {
        if (!element) return;

        element.addEventListener("change", () => {
            setState({
                generation: {
                    [property]: element.checked
                }
            });
        });
    }

    updateCoordinates() {
        const latitude =
            Number(this.elements.latitude?.value);

        const longitude =
            Number(this.elements.longitude?.value);

        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {
            setError("Invalid latitude.");
            return;
        }

        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            setError("Invalid longitude.");
            return;
        }

        setLocation(latitude, longitude);

        clearError();
    }

    checkResolution(width, height) {
        const result =
            getResolutionWarning(width, height);

        if (result.level === "error") {
            setError(result.message);
        } else {
            clearError();

            if (result.level === "warning") {
                console.warn(result.message);
            }
        }
    }

    async preview3D() {
        if (this.state.loading) return;

        try {
            setLoading(true);
            clearError();

            console.log("Starting 3D preview...");

            /*
             * Phase 2:
             *
             * 1. Load OSM
             * 2. Load elevation
             * 3. Convert coordinates
             * 4. Build roads
             * 5. Build buildings
             * 6. Build water
             * 7. Build parking
             * 8. Build fences
             * 9. Build streetlights
             * 10. Build utility poles
             */

            await this.delay(100);

            setState({
                preview: {
                    active: true
                }
            });

            console.log("3D preview ready.");
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Unable to create 3D preview."
            );
        } finally {
            setLoading(false);
        }
    }

    async generateData() {
        if (this.state.loading) return;

        try {
            setLoading(true);
            clearError();

            console.log("Generating map data...");

            /*
             * This will eventually create:
             *
             * terrain
             * roads
             * buildings
             * bridges
             * water
             * parking
             * fences
             * streetlights
             * utility poles
             */

            await this.delay(100);

            setState({
                export: {
                    generated: true
                }
            });

            console.log("Map data generated.");
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Map generation failed."
            );
        } finally {
            setLoading(false);
        }
    }

    async exportBeamNG() {
        if (this.state.loading) return;

        const { width, height } = this.state.map;

        const warning =
            getResolutionWarning(width, height);

        if (warning.level === "error") {
            setError(warning.message);
            return;
        }

        try {
            setLoading(true);
            clearError();

            console.log(
                "Preparing BeamNG level export..."
            );

            /*
             * IMPORTANT:
             *
             * The actual BeamNG exporter should be placed
             * in /js/export/
             *
             * app.js only controls the process.
             */

            await this.delay(100);

            console.log(
                "BeamNG export preparation complete."
            );
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "BeamNG export failed."
            );
        } finally {
            setLoading(false);
        }
    }

    updateUI() {
        const state = this.state;

        if (this.elements.latitude) {
            this.elements.latitude.value =
                state.location.latitude ?? "";
        }

        if (this.elements.longitude) {
            this.elements.longitude.value =
                state.location.longitude ?? "";
        }

        if (this.elements.resolution) {
            this.elements.resolution.value =
                state.map.width;
        }

        if (this.elements.metersPerPixel) {
            this.elements.metersPerPixel.value =
                state.map.metersPerPixel;
        }

        this.updateCheckbox(
            this.elements.osmCheckbox,
            state.generation.includeOSM
        );

        this.updateCheckbox(
            this.elements.smoothRoads,
            state.generation.smoothRoads
        );

        this.updateCheckbox(
            this.elements.levelRoads,
            state.generation.levelRoads
        );

        this.updateCheckbox(
            this.elements.buildings,
            state.generation.buildings
        );

        this.updateCheckbox(
            this.elements.bridges,
            state.generation.bridges
        );

        this.updateCheckbox(
            this.elements.water,
            state.generation.water
        );

        this.updateCheckbox(
            this.elements.parking,
            state.generation.parking
        );

        this.updateCheckbox(
            this.elements.fences,
            state.generation.fences
        );

        this.updateCheckbox(
            this.elements.streetlights,
            state.generation.streetlights
        );

        this.updateCheckbox(
            this.elements.utilityPoles,
            state.generation.utilityPoles
        );

        if (state.loading) {
            document.body.classList.add(
                "app-loading"
            );
        } else {
            document.body.classList.remove(
                "app-loading"
            );
        }
    }

    updateCheckbox(element, value) {
        if (element) {
            element.checked = Boolean(value);
        }
    }

    delay(ms) {
        return new Promise(resolve =>
            setTimeout(resolve, ms)
        );
    }
}

const app = new SuperMapNG();

window.SuperMapNG = app;

export default app;
