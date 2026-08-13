import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

export function createHouse() {
    const group = new THREE.Group();

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xd8c8b0
        });

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x494949
        });

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(20, 8, 16),
        wallMaterial
    );

    body.position.y = 4;
    body.castShadow = true;
    body.receiveShadow = true;

    group.add(body);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(14, 6, 4),
        roofMaterial
    );

    roof.rotation.y = Math.PI / 4;
    roof.position.y = 11;

    roof.castShadow = true;
    roof.receiveShadow = true;

    group.add(roof);

    return group;
}
