import { createScene } from "./scene.js";
import { generateMap } from "./generator.js";

const viewport =
    document.getElementById("viewport");

const engine = createScene(viewport);

const generateButton =
    document.getElementById("generateButton");

const exportButton =
    document.getElementById("exportButton");

function getOptions() {
    return {
        width: Number(
            document.getElementById("mapWidth").value
        ),

        height: Number(
            document.getElementById("mapHeight").value
        ),

        latitude: Number(
            document.getElementById("latitude").value
        ),

        longitude: Number(
            document.getElementById("longitude").value
        ),

        buildings:
            document.getElementById("buildings").checked,

        roads:
            document.getElementById("roads").checked,

        vegetation:
            document.getElementById("vegetation").checked,

        curbs:
            document.getElementById("curbs").checked
    };
}

function generate() {
    const options = getOptions();

    generateMap(
        engine.scene,
        options
    );
}

generateButton.addEventListener(
    "click",
    generate
);

exportButton.addEventListener(
    "click",
    () => {
        const options = getOptions();

        const blob = new Blob(
            [JSON.stringify(options, null, 2)],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "super-mapng-map.json";

        link.click();

        URL.revokeObjectURL(url);
    }
);

generate();
