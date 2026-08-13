export function parseOSM(data) {

    const nodes = new Map();

    const ways = [];

    const result = {
        nodes,
        ways,
        roads: [],
        buildings: [],
        water: [],
        parking: [],
        fences: [],
        streetlights: [],
        utilityPoles: []
    };

    for (const element of data.elements) {

        if (element.type === "node") {

            nodes.set(
                element.id,
                element
            );

        }

    }

    for (const element of data.elements) {

        if (element.type !== "way") {
            continue;
        }

        const tags = element.tags || {};

        const points =
            element.nodes
                .map(id => nodes.get(id))
                .filter(Boolean);

        const feature = {
            id: element.id,
            tags,
            points
        };

        if (tags.building) {
            result.buildings.push(feature);
        }

        if (tags.highway) {
            result.roads.push(feature);
        }

        if (
            tags.waterway ||
            tags.natural === "water"
        ) {
            result.water.push(feature);
        }

        if (tags.amenity === "parking") {
            result.parking.push(feature);
        }

        if (tags.barrier) {
            result.fences.push(feature);
        }

        result.ways.push(feature);
    }

    for (const element of data.elements) {

        if (element.type !== "node") {
            continue;
        }

        const tags = element.tags || {};

        if (tags.highway === "street_lamp") {
            result.streetlights.push(element);
        }

        if (tags.power === "pole") {
            result.utilityPoles.push(element);
        }

    }

    return result;
}
