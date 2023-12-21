"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const originalBoard = lines.map((l) => l.split('').map((s) => parseInt(s)));
    const graph = new Map();
    originalBoard.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const key = `${rowIndex},${columnIndex}`;
            const up = rowIndex > 0 ? `${rowIndex - 1},${columnIndex}` : null;
            const down = rowIndex < originalBoard.length - 1 ? `${rowIndex + 1},${columnIndex}` : null;
            const left = columnIndex > 0 ? `${rowIndex},${columnIndex - 1}` : null;
            const right = columnIndex < row.length - 1 ? `${rowIndex},${columnIndex + 1}` : null;
            const neighbors = new Map();
            if (up) {
                neighbors.set(up, originalBoard[rowIndex - 1][columnIndex]);
            }
            if (down) {
                neighbors.set(down, originalBoard[rowIndex + 1][columnIndex]);
            }
            if (left) {
                neighbors.set(left, originalBoard[rowIndex][columnIndex - 1]);
            }
            if (right) {
                neighbors.set(right, originalBoard[rowIndex][columnIndex + 1]);
            }
            graph.set(key, neighbors);
        });
    });
    console.log(`graph`, graph);
    function dijkstra(graph, start, end) {
        console.log(`start`, start);
        console.log(`end`, end);
        let distances = {};
        let previous = {};
        let unvisited = new Set();
        graph.forEach((_, node) => {
            distances[node] = node === start ? 0 : Infinity;
            unvisited.add(node);
        });
        console.log(`unvisited`, unvisited);
        while (unvisited.size) {
            let closestNode = null;
            unvisited.forEach((node) => {
                if (!closestNode || distances[node] < distances[closestNode]) {
                    closestNode = node;
                }
            });
            if (typeof closestNode !== 'string') {
                break;
            }
            if (distances[closestNode] === Infinity) {
                break;
            }
            if (closestNode === end) {
                console.log(`distances`, distances);
                console.log(`previous`, previous);
                break;
            }
            graph.get(closestNode)?.forEach((_, neighbor) => {
                if (typeof closestNode !== 'string') {
                    return;
                }
                const neighborWeight = graph.get(closestNode)?.get(neighbor) ?? Infinity;
                let newDistance = distances[closestNode] + neighborWeight;
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = closestNode;
                }
            });
            unvisited.delete(closestNode);
        }
        const path = [];
        let node = end;
        while (node) {
            path.unshift(node);
            node = previous[node];
        }
        console.log(`path`, path);
        console.log(`GRID -------------------------`);
        originalBoard.forEach((row, rowIndex) => {
            const formattedRow = row.map((column, columnIndex) => {
                const key = `${rowIndex},${columnIndex}`;
                return path.includes(key) ? '.' : String(originalBoard[rowIndex][columnIndex]);
            });
            console.log(formattedRow.join(''));
        });
    }
    // bfs();
    dijkstra(graph, '0,0', `${originalBoard.length - 1},${originalBoard[0].length - 1}`);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map