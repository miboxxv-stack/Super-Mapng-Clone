import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

export function createTerrain(size) {
    const geometry = new THREE.PlaneGeometry(
        size,
        size,
        32,
        32
    );

    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
        color: 0x5f8050,
        roughness: 1
    });

    const terrain = new THREE.Mesh(
        geometry,
        material
    );

    terrain.receiveShadow = true;

    return terrain;
}
