import { createTerrain } from "./terrain.js";
import { createRoad } from "./roads.js";
import { createHouse } from "./buildings.js";
import { createTrees } from "./vegetation.js";

export function generateMap(scene, options) {
    scene.clear();

    const terrainSize = options.width;

    const terrain = createTerrain(terrainSize);
    scene.add(terrain);

    if (options.roads) {
        scene.add(createRoad());
    }

    if (options.buildings) {
        const house1 = createHouse();
        house1.position.set(-50, 0, -60);
        scene.add(house1);

        const house2 = createHouse();
        house2.position.set(50, 0, 60);
        house2.rotation.y = Math.PI / 2;
        scene.add(house2);
    }

    if (options.vegetation) {
        scene.add(
            createTrees(
                Math.min(500, Math.floor(terrainSize / 2)),
                terrainSize
            )
        );
    }
}
