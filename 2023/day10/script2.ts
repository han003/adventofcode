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
        const row = tileMap.findIndex((line) => line.some((tile) => tile === 'S'));
        const column = tileMap[row].findIndex((tile) => tile === 'S');
        return {
            tile: 'S',
            location: {x: column, y: row}
        };
    }

    function findSurroundingTilesThatTargetCanConnectTo(location: Location) {
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
    loop[0].tile = startTile;
    console.log(`loop`, loop);

    let outsides = new Set<string>();
    let handDirections: TileConnection[] = ['north'];

    loop.forEach((location, index) => {
        console.log(`index`, index);

        let extraDirections: TileConnection[] = [];

        if (location.tile === 'F') {
            handDirections = ['south'];
        }
        if (location.tile === '7') {
            handDirections = ['west'];
        }
        if (location.tile === 'J') {
            handDirections = ['north'];
        }
        if (location.tile === 'L') {
            handDirections = ['east'];
        }

        [...handDirections, ...extraDirections].forEach((direction) => {
            if (direction === 'north') {
                let index = 1;
                let loc: Location['location'] = {x: location.location.x, y: location.location.y - index}
                let tile = getTileAtLocation(loc.x, loc.y);

                while (tile === '.') {
                    outsides.add(`${location.location.x},${location.location.y - index}`);

                    index++;
                    loc = {x: location.location.x, y: location.location.y - index}
                    tile = getTileAtLocation(loc.x, loc.y);
                }
            }

            if (direction === 'east') {
                let index = 1;
                let loc: Location['location'] = {x: location.location.x + index, y: location.location.y}
                let tile = getTileAtLocation(loc.x, loc.y);

                while (tile === '.') {
                    outsides.add(`${location.location.x + index},${location.location.y}`);

                    index++;
                    loc = {x: location.location.x + index, y: location.location.y}
                    tile = getTileAtLocation(loc.x, loc.y);
                }
            }

            if (direction === 'south') {
                let index = 1;
                let loc: Location['location'] = {x: location.location.x, y: location.location.y + index}
                let tile = getTileAtLocation(loc.x, loc.y);

                while (tile === '.') {
                    outsides.add(`${location.location.x},${location.location.y + index}`);

                    index++;
                    loc = {x: location.location.x, y: location.location.y + index}
                    tile = getTileAtLocation(loc.x, loc.y);
                }
            }

            if (direction === 'west') {
                let index = 1;
                let loc: Location['location'] = {x: location.location.x - index, y: location.location.y}
                let tile = getTileAtLocation(loc.x, loc.y);

                while (tile === '.') {
                    outsides.add(`${location.location.x - index},${location.location.y}`);

                    index++;
                    loc = {x: location.location.x - index, y: location.location.y}
                    tile = getTileAtLocation(loc.x, loc.y);
                }
            }
        });
    });

    console.log(`outsides`, outsides, outsides.size);

    console.log(`time`, performance.now() - start);
})();
