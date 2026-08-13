const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];

export async function fetchOSM(
    south,
    west,
    north,
    east
) {

    const query = `
[out:json][timeout:60];

(
    way["highway"](${south},${west},${north},${east});
    way["building"](${south},${west},${north},${east});

    way["waterway"](${south},${west},${north},${east});
    way["natural"="water"](${south},${west},${north},${east});

    way["amenity"="parking"](${south},${west},${north},${east});

    way["barrier"](${south},${west},${north},${east});

    node["highway"="street_lamp"](${south},${west},${north},${east});

    node["power"="pole"](${south},${west},${north},${east});
);

out body;
>;
out skel qt;
`;

    let lastError;

    for (const endpoint of OVERPASS_ENDPOINTS) {

        try {

            const response =
                await fetch(endpoint, {
                    method: "POST",
                    body: query,
                    headers: {
                        "Content-Type":
                            "text/plain"
                    }
                });

            if (!response.ok) {
                throw new Error(
                    `Overpass HTTP ${response.status}`
                );
            }

            return await response.json();

        } catch (error) {

            lastError = error;

        }

    }

    throw lastError;
}
