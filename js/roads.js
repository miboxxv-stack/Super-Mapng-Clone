import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

export function createRoad(length = 400) {
    const group = new THREE.Group();

    const roadGeometry = new THREE.BoxGeometry(
        24,
        0.15,
        length
    );

    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x303030
    });

    const road = new THREE.Mesh(
        roadGeometry,
        roadMaterial
    );

    road.position.y = 0.08;
    road.receiveShadow = true;

    group.add(road);

    const sidewalkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x989898
        });

    const curbMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xb4b4b4
        });

    for (const side of [-1, 1]) {
        const sidewalk = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0.18, length),
            sidewalkMaterial
        );

        sidewalk.position.set(
            side * 14,
            0.12,
            0
        );

        sidewalk.receiveShadow = true;
        group.add(sidewalk);

        const curb = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.35, length),
            curbMaterial
        );

        curb.position.set(
            side * 11.75,
            0.25,
            0
        );

        curb.castShadow = true;
        curb.receiveShadow = true;

        group.add(curb);
    }

    return group;
}
