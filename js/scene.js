import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("three-container");
const map = document.getElementById("map");

if (!container || !map) {
    throw new Error(
        "Super-MapNG: #three-container or #map was not found."
    );
}

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x9ec7e5);

const camera = new THREE.PerspectiveCamera(
    55,
    1,
    0.1,
    10000
);

camera.position.set(
    350,
    300,
    350
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(
    renderer.domElement
);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.minDistance = 20;
controls.maxDistance = 5000;

controls.maxPolarAngle =
    Math.PI * 0.48;

controls.target.set(
    0,
    0,
    0
);


// ================================
// LIGHTING
// ================================

const hemisphere =
    new THREE.HemisphereLight(
        0xddeeff,
        0x5b6d51,
        2.1
    );

scene.add(hemisphere);

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3.2
    );

sun.position.set(
    300,
    500,
    200
);

sun.castShadow = true;

sun.shadow.mapSize.set(
    2048,
    2048
);

scene.add(sun);


// ================================
// DEMO TERRAIN
// ================================

const terrainSize = 1082;

const geometry =
    new THREE.PlaneGeometry(
        terrainSize,
        terrainSize,
        100,
        100
    );

geometry.rotateX(
    -Math.PI / 2
);

const positions =
    geometry.attributes.position;

for (
    let i = 0;
    i < positions.count;
    i++
) {

    const x =
        positions.getX(i);

    const z =
        positions.getZ(i);

    const height =
        Math.sin(x * 0.015) * 2.5 +
        Math.cos(z * 0.012) * 2 +
        Math.sin((x + z) * 0.006) * 5;

    positions.setY(
        i,
        height
    );
}

positions.needsUpdate = true;

geometry.computeVertexNormals();

const terrainMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x65845c,
        roughness: 1
    });

const terrain =
    new THREE.Mesh(
        geometry,
        terrainMaterial
    );

terrain.receiveShadow = true;

scene.add(terrain);


// ================================
// WATER
// ================================

const waterGeometry =
    new THREE.PlaneGeometry(
        240,
        150
    );

waterGeometry.rotateX(
    -Math.PI / 2
);

const waterMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3e8fa8,
        transparent: true,
        opacity: 0.78,
        roughness: 0.12
    });

const water =
    new THREE.Mesh(
        waterGeometry,
        waterMaterial
    );

water.position.set(
    160,
    5,
    -180
);

scene.add(water);


// ================================
// DEMO ROAD
// ================================

const roadGeometry =
    new THREE.BoxGeometry(
        26,
        0.25,
        900
    );

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x303030,
        roughness: 0.96
    });

const road =
    new THREE.Mesh(
        roadGeometry,
        roadMaterial
    );

road.position.set(
    -130,
    5,
    0
);

road.receiveShadow = true;

scene.add(road);


// ================================
// DEMO BUILDINGS
// ================================

function addBuilding(
    x,
    z,
    width,
    depth,
    height
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xcfc2ab,
            roughness: 0.82
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2 + 5,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);

    return building;
}

addBuilding(
    -90,
    -90,
    32,
    24,
    11
);

addBuilding(
    -45,
    -75,
    24,
    20,
    8
);

addBuilding(
    -30,
    75,
    70,
    46,
    12
);


// ================================
// TREES
// ================================

const trunkGeometry =
    new THREE.CylinderGeometry(
        0.5,
        0.7,
        4,
        8
    );

const leafGeometry =
    new THREE.ConeGeometry(
        3.4,
        8,
        8
    );

const trunkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x65452d
    });

const leafMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x2f6334
    });

const treeCount = 180;

const trunks =
    new THREE.InstancedMesh(
        trunkGeometry,
        trunkMaterial,
        treeCount
    );

const leaves =
    new THREE.InstancedMesh(
        leafGeometry,
        leafMaterial,
        treeCount
    );

const matrix =
    new THREE.Matrix4();

for (
    let i = 0;
    i < treeCount;
    i++
) {

    const x =
        -500 + Math.random() * 1000;

    const z =
        -500 + Math.random() * 1000;

    const scale =
        0.75 + Math.random() * 0.65;

    matrix.compose(
        new THREE.Vector3(
            x,
            7,
            z
        ),
        new THREE.Quaternion(),
        new THREE.Vector3(
            scale,
            scale,
            scale
        )
    );

    leaves.setMatrixAt(
        i,
        matrix
    );

    matrix.compose(
        new THREE.Vector3(
            x,
            2,
            z
        ),
        new THREE.Quaternion(),
        new THREE.Vector3(
            scale,
            scale,
            scale
        )
    );

    trunks.setMatrixAt(
        i,
        matrix
    );
}

scene.add(trunks);
scene.add(leaves);


// ================================
// RESIZE
// ================================

function resize() {

    const width =
        map.clientWidth;

    const height =
        map.clientHeight;

    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height,
        false
    );
}

window.addEventListener(
    "resize",
    resize
);

resize();


// ================================
// CAMERA BUTTONS
// ================================

document
    .getElementById("cameraHome")
    ?.addEventListener(
        "click",
        () => {

            camera.position.set(
                350,
                300,
                350
            );

            controls.target.set(
                0,
                0,
                0
            );

            controls.update();
        }
    );

document
    .getElementById("cameraTop")
    ?.addEventListener(
        "click",
        () => {

            camera.position.set(
                0,
                850,
                0
            );

            controls.target.set(
                0,
                0,
                0
            );

            controls.update();
        }
    );

document
    .getElementById("cameraOrbit")
    ?.addEventListener(
        "click",
        () => {

            camera.position.set(
                500,
                180,
                150
            );

            controls.target.set(
                0,
                0,
                0
            );

            controls.update();
        }
    );


// ================================
// RENDER LOOP
// ================================

function animate() {

    requestAnimationFrame(
        animate
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ================================
// GLOBAL ENGINE
// ================================

window.SuperMapNGThree = {

    THREE,

    scene,

    camera,

    renderer,

    controls,

    terrain,

    water,

    road

};

const status =
    document.getElementById(
        "map-engine-status"
    );

if (status) {

    status.textContent =
        "Three.js scene ready · 3D terrain preview active";

}
