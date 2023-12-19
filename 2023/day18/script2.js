"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const coordinates = [];
    let previousCoordinates = { row: 0, column: 0 };
    lines.forEach((line) => {
        const [direction, distance, color] = line.split(' ');
        const distanceInt = parseInt(color.substring(2, color.length - 2), 16);
        let movement = { row: 0, column: 0 };
        if (direction === 'R') {
            movement = { row: 0, column: 1 };
        }
        if (direction === 'L') {
            movement = { row: 0, column: -1 };
        }
        if (direction === 'U') {
            movement = { row: -1, column: 0 };
        }
        if (direction === 'D') {
            movement = { row: 1, column: 0 };
        }
        for (let i = 0; i < distanceInt; i++) {
            const newCoordinates = { row: previousCoordinates.row + movement.row, column: previousCoordinates.column + movement.column };
            coordinates.push(newCoordinates);
            previousCoordinates = newCoordinates;
        }
    });
    const maxRight = Math.abs(coordinates.reduce((acc, c) => c.column > acc ? c.column : acc, 0));
    console.log(`maxRight`, maxRight);
    const maxLeft = Math.abs(coordinates.reduce((acc, c) => c.column < acc ? c.column : acc, 0));
    console.log(`maxLeft`, maxLeft);
    const maxUp = Math.abs(coordinates.reduce((acc, c) => c.row < acc ? c.row : acc, 0));
    console.log(`maxUp`, maxUp);
    const maxDown = Math.abs(coordinates.reduce((acc, c) => c.row > acc ? c.row : acc, 0));
    console.log(`maxDown`, maxDown);
    coordinates.forEach((c) => {
        c.column += maxLeft;
        c.row += maxUp;
    });
    const gridRows = coordinates.reduce((acc, c) => c.row > acc ? c.row : acc, 0);
    console.log(`gridRows`, gridRows);
    const gridColumns = coordinates.reduce((acc, c) => c.column > acc ? c.column : acc, 0);
    console.log(`gridColumns`, gridColumns);
    const coordinatesSet = new Set();
    coordinates.forEach((c) => {
        coordinatesSet.add(`${c.row},${c.column}`);
    });
    console.log(`coordinatesSet.size`, coordinatesSet.size);
    const checkTiles = new Set();
    // Top row
    for (let i = 0; i <= gridColumns; i++) {
        const key = `${0},${i}`;
        if (!coordinatesSet.has(key)) {
            checkTiles.add(key);
        }
    }
    console.log(`Check`, checkTiles.size);
    // Bottom row
    for (let i = 0; i <= gridColumns; i++) {
        const key = `${gridRows},${i}`;
        if (!coordinatesSet.has(key)) {
            checkTiles.add(key);
        }
    }
    console.log(`Check`, checkTiles.size);
    // Left column
    for (let i = 0; i <= gridRows; i++) {
        const key = `${i},${0}`;
        if (!coordinatesSet.has(key)) {
            checkTiles.add(key);
        }
    }
    console.log(`Check`, checkTiles.size);
    // Right column
    for (let i = 0; i <= gridRows; i++) {
        const key = `${i},${gridColumns}`;
        if (!coordinatesSet.has(key)) {
            checkTiles.add(key);
        }
    }
    console.log(`Check`, checkTiles.size);
    function getVisitedAtLocation(row, column, visited) {
        if (visited.has(`${row},${column}`)) {
            return visited;
        }
        const queue = [];
        queue.push({ row, column });
        visited.add(`${row},${column}`);
        while (queue.length) {
            const current = queue.shift();
            const { row, column } = current;
            const neighbors = [
                { row: row - 1, column },
                { row: row + 1, column },
                { row, column: column - 1 },
                { row, column: column + 1 },
            ];
            neighbors.forEach((neighbor) => {
                const { row, column } = neighbor;
                if (row < 0 || column < 0 || row >= gridRows || column >= gridColumns) {
                    return;
                }
                const key = `${row},${column}`;
                const isTrench = coordinatesSet.has(key);
                if (!isTrench && !visited.has(key)) {
                    queue.push(neighbor);
                    visited.add(`${row},${column}`);
                }
            });
        }
        return visited;
    }
    let visited = new Set();
    console.log(`checkTiles.size`, checkTiles.size);
    checkTiles.forEach((tile) => {
        const [row, column] = tile.split(',').map((n) => parseInt(n));
        visited = getVisitedAtLocation(row, column, visited);
    });
    console.log(`visited.size`, visited.size);
    const totalArea = (gridRows + 1) * (gridColumns + 1);
    console.log(`totalArea`, totalArea);
    console.log(`totalArea - visited.size`, totalArea - visited.size);
    // Trench is the number of # tiles
    const trench = coordinates.length;
    console.log(`trench`, trench);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script2.js.map