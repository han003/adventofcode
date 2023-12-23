"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    function getKey(row, col) {
        return `${row}:${col}`;
    }
    function printGrid() {
        for (let row = 0; row < lines.length - 1; row++) {
            for (let col = 0; col < lines[row].length - 1; col++) {
                const key = getKey(row, col);
                const tile = grid.get(key);
                if (!tile) {
                    throw new Error(`No tile`);
                }
                if (visited.has(key)) {
                    if (tile.start) {
                        process.stdout.write('S');
                    }
                    else {
                        process.stdout.write(stepInfo.get(key)?.toString() || ' ');
                    }
                }
                else if (tile.rock) {
                    process.stdout.write('#');
                }
                else {
                    process.stdout.write('.');
                }
            }
            process.stdout.write('\n');
        }
    }
    const grid = lines.reduce((acc, row, rowIndex) => {
        row.split('').map((column, columnIndex) => {
            acc.set(getKey(rowIndex, columnIndex), {
                rock: lines[rowIndex].charAt(columnIndex) === '#',
                garden: lines[rowIndex].charAt(columnIndex) === '#',
                start: lines[rowIndex].charAt(columnIndex) === 'S',
                row: rowIndex,
                column: columnIndex,
                key: getKey(rowIndex, columnIndex),
                step: 0,
            });
        });
        return acc;
    }, new Map());
    let queue = new Map();
    const visited = new Set();
    const stepInfo = new Map();
    const startTile = Array.from(grid).find(([_, tile]) => tile.start)?.[1];
    if (!startTile) {
        throw new Error(`No start tile found`);
    }
    queue.set(startTile.key, startTile);
    let maxSteps = 64;
    for (let i = 0; i < maxSteps; i++) {
        const nextQueue = new Map();
        queue.forEach((tile) => {
            const neighbours = [
                grid.get(getKey(tile.row - 1, tile.column)),
                grid.get(getKey(tile.row + 1, tile.column)),
                grid.get(getKey(tile.row, tile.column - 1)),
                grid.get(getKey(tile.row, tile.column + 1)),
            ];
            neighbours.forEach((neighbour) => {
                if (!neighbour) {
                    return;
                }
                if (neighbour.rock) {
                    return;
                }
                neighbour.step = tile.step + 1;
                nextQueue.set(neighbour.key, neighbour);
            });
        });
        console.log(`nextQueue.length`, nextQueue.size);
        queue = nextQueue;
    }
    console.log(`queue`, queue.size);
    console.log(`stepInfo`, stepInfo);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map