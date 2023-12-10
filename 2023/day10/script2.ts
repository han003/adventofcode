(function () {
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
        console.log(`location`, location);
        const surroundingTiles: Location[] = [];
        const tile = location.tile;
        const x = location.location.x;
        const y = location.location.y;

        // North
        const northTile = getTileAtLocation(x, y - 1);
        if (northTile) {
            tileInfo[tile].north && tileInfo[northTile].south && surroundingTiles.push({
                tile: northTile,
                location: {x: x, y: y - 1}
            });
        }

        // East
        const eastTile = getTileAtLocation(x + 1, y);
        if (eastTile) {
            tileInfo[tile].east && tileInfo[eastTile].west && surroundingTiles.push({
                tile: eastTile,
                location: {x: x + 1, y: y}
            })
        }

        // South
        const southTile = getTileAtLocation(x, y + 1)!;
        if (southTile) {
            tileInfo[tile].south && tileInfo[southTile].north && surroundingTiles.push({
                tile: southTile,
                location: {x, y: y + 1}
            })
        }

        // West
        const westTile = getTileAtLocation(x - 1, y)!;
        if (westTile) {
            tileInfo[tile].west && tileInfo[westTile].east && surroundingTiles.push({
                tile: westTile,
                location: {x: x - 1, y}
            })
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
            console.log(`tile`, tile, surroundingTiles);
            if (surroundingTiles.length === 2) {
                startTile = tile as Tile;
            }
        });

        return startTile;
    }

    const startLocation = findStartLocation();
    console.log(`startLocation`, startLocation);
    const startTile = getStartTile(startLocation);
    console.log(`startTile`, startTile);
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

    console.log(`startLocation.tile`, startLocation.tile);

    console.log(`loop`, loop);

    let insides = 0;
    let checks = 0;

    tileMap.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const tile = tileMap[rowIndex][columnIndex];
            if (tile === '.') {
                console.log(rowIndex, columnIndex);
                checks++;

                const loopsNorth = loop.filter((location) => location.location.x === columnIndex && location.location.y < rowIndex).length;
                const loopsEast = loop.filter((location) => location.location.y === rowIndex && location.location.x > columnIndex).length;
                const loopsSouth = loop.filter((location) => location.location.x === columnIndex && location.location.y > rowIndex).length;
                const loopsWest = loop.filter((location) => location.location.y === rowIndex && location.location.x < columnIndex).length;
                const loops = [loopsEast, loopsNorth, loopsSouth, loopsWest];
                const outside = loops.some((l) => l % 2 === 0);

                console.log(`loops`, loops, outside
                );

                if (!outside) {
                    insides++;
                }
            }
        });
    })

    console.log(`checks`, checks);
    console.log(`insides`, insides);

    console.log(`time`, performance.now() - start);
})();
