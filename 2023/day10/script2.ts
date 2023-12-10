(function () {
    const answer = 1647269739;
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.clear();

    type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
    type Location = { tile: Tile, location: { x: number, y: number } };
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

    function getTileAtLocation(x: number | null, y: number | null): Tile | null {
        if (x === null || y === null) {
            return null;
        }

        try {
            return tileMap[y][x];
        } catch (e) {
            return null;
        }
    }

    function findStartLocation(): Location {
        const start = tileMap.findIndex((line) => line.some((tile) => tile === 'S'));
        const end = tileMap[start].findIndex((tile) => tile === 'S');
        return {
            tile: 'S',
            location: {x: start, y: end}
        };
    }

    function findSurroundingTilesThatTargetCanConnectTo(location: Location) {
        const surroundingTiles: Location[] = [];
        const tile = location.tile;
        const x = location.location.x;
        const y = location.location.y;

        // North
        const northTile = getTileAtLocation(x, y - 1)!;
        tileInfo[tile].north && tileInfo[northTile].south && surroundingTiles.push({
            tile: northTile,
            location: {x: x, y: y - 1}
        });

        // East
        const eastTile = getTileAtLocation(x + 1, y)!;
        tileInfo[tile].east && tileInfo[eastTile].west && surroundingTiles.push({
            tile: eastTile,
            location: {x: x + 1, y: y}
        });

        // South
        const southTile = getTileAtLocation(x, y + 1)!;
        tileInfo[tile].south && tileInfo[southTile].north && surroundingTiles.push({
            tile: southTile,
            location: {x, y: y + 1}
        });

        // West
        const westTile = getTileAtLocation(x - 1, y)!;
        tileInfo[tile].west && tileInfo[westTile].east && surroundingTiles.push({
            tile: westTile,
            location: {x: x - 1, y}
        });

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

    function getInsideDirection(location: Location): TileConnection {
        if (location.tile === '-') {
            return 'east';
        }

        return 'east'
    }


    const startLocation = findStartLocation();
    const startTile = getStartTile(startLocation);
    tileMap[startLocation.location.x][startLocation.location.y] = startTile!;

    if (!startTile) {
        return;
    }

    let loop: Location[] = [];
    let currentLocation: Location = startLocation;
    let previousLocation: Location | null = null;

    while ((currentLocation.location.x !== startLocation.location.x || currentLocation.location.y !== startLocation.location.y) || previousLocation === null) {
        loop.push(currentLocation);
        let surrounding = findSurroundingTilesThatTargetCanConnectTo(currentLocation);
        let nextLocation: Location;

        if (!previousLocation) {
            nextLocation = surrounding[0];
        } else {
            nextLocation = surrounding.find((location) => {
                return location.location.x !== previousLocation!.location.x || location.location.y !== previousLocation!.location.y;
            })!;
        }

        previousLocation = currentLocation;
        currentLocation = nextLocation;
    }

    const insides = new Set<string>();
    console.log(`startLocation.tile`, startLocation.tile);

    function getWallDirection(index: number, startTile: Tile) {
        const startTileCorner = ['L', 'J', '7', 'F'].includes(startTile) ? startTile : loop.find((location) => ['L', 'J', '7', 'F'].includes(location.tile))?.tile;
        const nextCorner = loop.slice(index).find((location) => ['L', 'J', '7', 'F'].includes(location.tile))?.tile || startTileCorner;
        const previousCorner = loop.slice(0, index).reverse().find((location) => ['L', 'J', '7', 'F'].includes(location.tile))?.tile || startTileCorner;

        return [previousCorner, nextCorner];
    }

    loop.forEach((location) => {
        if (location.tile === '-') {
            console.log(`location`, location);
            let northIndex: number | null = location.location.y - 1;
            let found = false;
            console.log(`northIndex`, northIndex);
            while (!found) {
                const tile = getTileAtLocation(location.location.x, northIndex)
                if (tile === null) {
                    found = true;
                    northIndex = null;
                }

                if (tile !== '.' && tile !== 'S') {
                    found = true;
                    console.log(`found`, tile);
                } else {
                    if (northIndex !== null) {
                        northIndex--;
                    }
                }
            }

            console.log(`northIndex`, northIndex);

            if (northIndex !== null) {
                const nextNorthLoop = loop.find((l) => l.location.y === northIndex && l.location.x === location.location.x)!;
                console.log(`nextNorthLoop`, northIndex, nextNorthLoop);
                console.log(`getWallDirection(i, startTile)`, getWallDirection(northIndex, nextNorthLoop.tile));
            }
        }

        console.log(`-----------------------------`,);
    });

    console.log(`time`, performance.now() - start);
})();
