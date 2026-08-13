import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

export function createTrees(count = 100, area = 400) {
    const group = new THREE.Group();

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.5,
            0.65,
            4,
            6
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6b4d32
        });

    const leavesGeometry =
        new THREE.ConeGeometry(
            3,
            8,
            8
        );

    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x315f32
        });

    const trunks = new THREE.InstancedMesh(
        trunkGeometry,
        trunkMaterial,
        count
    );

    const leaves = new THREE.InstancedMesh(
        leavesGeometry,
        leavesMaterial,
        count
    );

    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * area;
        const z = (Math.random() - 0.5) * area;

        matrix.makeTranslation(x, 2, z);
        trunks.setMatrixAt(i, matrix);

        matrix.makeTranslation(x, 8, z);
        leaves.setMatrixAt(i, matrix);
    }

    trunks.castShadow = true;
    leaves.castShadow = true;

    group.add(trunks);
    group.add(leaves);

    return group;
}
