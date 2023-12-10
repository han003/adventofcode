(function () {
    const answer = 1647269739;
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.clear();

    type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
    type Location = { tile: Tile, location: [number, number]};
    type TileConnection = 'north' | 'south' | 'east' | 'west';

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
        return {
            tile: 'S',
            location: [start, end],
        };
    }

    function findSurroundingTilesThatTargetCanConnectTo(location: Location) {
        const surroundingTiles: Location[] = [];
        const tile = location.tile;
        const x = location.location[0];
        const y = location.location[1];

        // North
        if (x > 0) {
            const northTile = tileMap[x - 1][y];
            tileInfo[tile].north && tileInfo[northTile].south && surroundingTiles.push({
                tile: northTile,
                location: [x - 1, y],
            });
        }

        // East
        if (y < tileMap[0].length - 1) {
            const eastTile = tileMap[x][y + 1];
            tileInfo[tile].east && tileInfo[eastTile].west && surroundingTiles.push({
                tile: eastTile,
                location: [x, y + 1],
            });
        }

        // South
        if (x < tileMap.length - 1) {
            const southTile = tileMap[x + 1][y];
            tileInfo[tile].south && tileInfo[southTile].north && surroundingTiles.push({
                tile: southTile,
                location: [x + 1, y],
            });
        }

        // West
        if (y > 0) {
            const westTile = tileMap[x][y - 1];
            tileInfo[tile].west && tileInfo[westTile].east && surroundingTiles.push({
                tile: westTile,
                location: [x, y - 1],
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

            const testLocation: Location = {tile: tile as Tile, location: location.location};
            const surroundingTiles = findSurroundingTilesThatTargetCanConnectTo(testLocation);
            if (surroundingTiles.length === 2) {
                startTile = tile as Tile;
            }
        });

        return startTile;
    }


    const startLocation = findStartLocation();
    console.log(`startLocation`, startLocation);
    const startTile = getStartTile(startLocation);

    console.log(`start`, startTile);

    if (!startTile) {
        return;
    }

    let moves = 0
    let currentLocation: Location = startLocation;
    let previousLocation: Location | null = null;

    while ((currentLocation.tile !== 'S' || previousLocation === null)) {
        console.log(`Current`, currentLocation.tile);
        moves++;
        let surrounding = findSurroundingTilesThatTargetCanConnectTo(currentLocation);
        let nextLocation: Location;

        if (!previousLocation) {
            nextLocation = surrounding[0];
        } else {
            nextLocation = surrounding.find((location) => {
                return location.location[0] !== previousLocation!.location[0] || location.location[1] !== previousLocation!.location[1];
            })!;
        }


        if (!nextLocation) {
            return;
        }

        previousLocation = currentLocation;
        currentLocation = nextLocation;
    }

    console.log(`total moves`, moves);
    console.log(`move`, moves / 2);

    console.log(`time`, performance.now() - start);
})();
