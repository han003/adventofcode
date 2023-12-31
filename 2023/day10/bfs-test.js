"use strict";
(function () {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    const start = performance.now();
    console.clear();
    const tileInfo = {
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
        '#': {
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
    };
    const tileMap = lines.reduce((acc, line) => {
        acc.push(line.split(''));
        return acc;
    }, []);
    function getTileAtLocation(x, y) {
        if (x === null || y === null) {
            return null;
        }
        try {
            return tileMap[y][x];
        }
        catch (e) {
            return null;
        }
    }
    function findStartLocation() {
        const row = tileMap.findIndex((line) => line.some((tile) => tile === 'S'));
        const column = tileMap[row].findIndex((tile) => tile === 'S');
        return {
            tile: getStartTile({ tile: 'S', location: { x: column, y: row } }),
            location: { x: column, y: row }
        };
    }
    function findSurroundingTilesThatTargetCanConnectTo(location) {
        const surroundingTiles = [];
        const tile = location.tile;
        const x = location.location.x;
        const y = location.location.y;
        // North
        const northTile = getTileAtLocation(x, y - 1);
        if (northTile) {
            tileInfo[tile].north && tileInfo[northTile].south && surroundingTiles.push({
                tile: northTile,
                location: { x: x, y: y - 1 }
            });
        }
        // East
        const eastTile = getTileAtLocation(x + 1, y);
        if (eastTile) {
            tileInfo[tile].east && tileInfo[eastTile].west && surroundingTiles.push({
                tile: eastTile,
                location: { x: x + 1, y: y }
            });
        }
        // South
        const southTile = getTileAtLocation(x, y + 1);
        if (southTile) {
            tileInfo[tile].south && tileInfo[southTile].north && surroundingTiles.push({
                tile: southTile,
                location: { x, y: y + 1 }
            });
        }
        // West
        const westTile = getTileAtLocation(x - 1, y);
        if (westTile) {
            tileInfo[tile].west && tileInfo[westTile].east && surroundingTiles.push({
                tile: westTile,
                location: { x: x - 1, y }
            });
        }
        return surroundingTiles;
    }
    function getStartTile(location) {
        let startTile = undefined;
        Object.keys(tileInfo).forEach((tile) => {
            if (tile === 'S') {
                return;
            }
            const testLocation = { tile: tile, location: location.location };
            const surroundingTiles = findSurroundingTilesThatTargetCanConnectTo(testLocation);
            if (surroundingTiles.length === 2) {
                startTile = tile;
            }
        });
        return startTile;
    }
    const startLocation = findStartLocation();
    console.log(`startLocation`, startLocation);
    let loop = [];
    console.log(`Answer 1`, loop.length / 2);
    let insides = 0;
    lines.forEach((line, lineIndex) => {
        line.split('').forEach((tile, tileIndex) => {
            const partOfLoop = loop.find(l => l.location.x === tileIndex && l.location.y === lineIndex);
            if (partOfLoop) {
                return;
            }
            let loopsRight = loop.filter(l => l.location.y === lineIndex && l.location.x > tileIndex).sort((a, b) => a.location.x - b.location.x);
            const wallsToTheRight = loopsRight.filter(l => l.tile !== '-').reduce((acc, l, index, arr) => {
                if (l.tile === '|') {
                    return (acc + 1);
                }
                const nextTile = arr[index + 1];
                if (!nextTile) {
                    return acc;
                }
                if (l.tile === 'L' && nextTile.tile === '7') {
                    return (acc + 1);
                }
                if (l.tile === 'F' && nextTile.tile === 'J') {
                    return (acc + 1);
                }
                return acc;
            }, 0);
            if (wallsToTheRight % 2 === 1) {
                insides++;
            }
        });
    });
    console.log(`insides`, insides);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=bfs-test.js.map