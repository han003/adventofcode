(function () {
    const answer = 1647269739;
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.clear();

    type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
    type Location = { tile: Tile, location: [number, number]};
    type TileConnection = 'north' | 'south' | 'east' | 'west';
    type SurroundingTiles = Record<string, number[]>;

    const tileInfo: Record<Tile, Record<TileConnection, boolean>> = {
        '|': {
            north: true,
            south: true,
            east: false,
            west: false,
        },
        '-': {
            north: false,
            south: false,
            east: true,
            west: true,
        },
        'L': {
            north: true,
            south: false,
            east: true,
            west: false,
        },
        'J': {
            north: true,
            south: false,
            east: false,
            west: true,
        },
        '7': {
            north: false,
            south: true,
            east: false,
            west: true,
        },
        'F': {
            north: false,
            south: true,
            east: true,
            west: false,
        },
        '.': {
            north: false,
            south: false,
            east: false,
            west: false,
        },
        'S': {
            north: true,
            south: true,
            east: true,
            west: true,
        },
    }

    const tileMap = lines.reduce((acc, line) => {
        acc.push(line.split('') as Tile[]);
        return acc;
    }, [] as Tile[][]);

    console.log(`map`, tileMap);

    function findStartLocation(): Location {
        const start = tileMap.findIndex((line) => line.some((tile) => tile === 'S'));
        const end = tileMap[start].findIndex((tile) => tile === 'S');
        return [start, end];
    }

    function findSurroundingTilesThatTargetCanConnectTo(tile: Tile, location: Location) {
        const surroundingTiles: { tile: Tile, location: Location }[] = [];

        // North
        if (location[0] > 0) {
            const northTile = tileMap[location[0] - 1][location[1]];
            tileInfo[tile].north && tileInfo[northTile].south && surroundingTiles.push({
                tile: northTile,
                location: [location[0] - 1, location[1]],
            });
        }

        // East
        if (location[1] < tileMap[0].length - 1) {
            const eastTile = tileMap[location[0]][location[1] + 1];
            tileInfo[tile].east && tileInfo[eastTile].west && surroundingTiles.push({
                tile: eastTile,
                location: [location[0], location[1] + 1],
            });
        }

        // South
        if (location[0] < tileMap.length - 1) {
            const southTile = tileMap[location[0] + 1][location[1]];
            tileInfo[tile].south && tileInfo[southTile].north && surroundingTiles.push({
                tile: southTile,
                location: [location[0] + 1, location[1]],
            });
        }

        // West
        if (location[1] > 0) {
            const westTile = tileMap[location[0]][location[1] - 1];
            tileInfo[tile].west && tileInfo[westTile].east && surroundingTiles.push({
                tile: westTile,
                location: [location[0], location[1] - 1],
            });
        }

        return surroundingTiles;
    }

    function getStartTile(location: Location): Tile | undefined {
        let startTile: Tile | undefined = undefined
        Object.keys(tileInfo).forEach((tile) => {
            if (tile === 'S') {
                return;
            }

            const surroundingTiles = findSurroundingTilesThatTargetCanConnectTo(tile as Tile, location);
            if (surroundingTiles.length === 2) {
                startTile = tile as Tile;
            }
        });

        return startTile;
    }


    const startLocation = findStartLocation();
    const startTile = getStartTile(startLocation);

    console.log(`start`, startTile);

    if (!startTile) {
        return;
    }

    let currentLocation: Location = startLocation;
    let previousLocation: Location | null = null;
    tileMap[startLocation[0]][startLocation[1]] = startTile;

    while (currentLocation !== startLocation || previousLocation === null) {
        let surrounding = findSurroundingTilesThatTargetCanConnectTo(startTile, currentLocation);
    }

    console.log(`surrounding`, surrounding);

    console.log(`go to `, surrounding[0]);

    surrounding = findSurroundingTilesThatTargetCanConnectTo(surrounding[0].tile, surrounding[0].location)
    console.log(`surrounding`, surrounding);

    console.log(`time`, performance.now() - start);
})();
