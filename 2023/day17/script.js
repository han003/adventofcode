"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const originalBoard = lines.map((l) => l.split('').map((s) => parseInt(s)));
    function getNeighbors(row, col, board, path) {
        console.log(`Get neighbors for`, row, col);
        const neighbors = [];
        // Up
        if (board[row + 1]?.[col] != null) {
            neighbors.push(new Coords(row + 1, col));
        }
        // Down
        if (board[row - 1]?.[col] != null) {
            neighbors.push(new Coords(row - 1, col));
        }
        // Left
        if (board[row]?.[col - 1] != null) {
            neighbors.push(new Coords(row, col - 1));
        }
        // Right
        if (board[row]?.[col + 1] != null) {
            // At the current position, where did we come from?
            const fromOne = path.get(new Coords(row, col).key);
            const fromTwo = fromOne ? path.get(fromOne?.coords.key) : undefined;
            const hasThreeLeft = (fromOne?.col === col - 1) && (fromTwo?.col === col - 2);
            const isStart = [fromOne, fromTwo].some((f) => f?.col === 0 && f?.row === 0);
            if (!hasThreeLeft && !isStart) {
                neighbors.push(new Coords(row, col + 1));
            }
        }
        return neighbors;
    }
    function reconstructPath(goal, start, path, board) {
        console.log(`PATH ----------------------------------------------------------`);
        const boardCopy = structuredClone(board);
        let current = goal;
        while (current !== start) {
            const currentCoords = current.split(',').map((n) => parseInt(n));
            boardCopy[currentCoords[0]][currentCoords[1]] = '.';
            const next = path.get(current)?.coords.key;
            if (!next) {
                break;
            }
            current = next;
        }
        boardCopy.forEach((row) => console.log(row.join(' ')));
    }
    class Coords {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
        get key() {
            return `${this.row},${this.col}`;
        }
    }
    function getPath(goal, start, path) {
        const pathArray = [];
        let current = path.get(goal);
        if (!current) {
            return [];
        }
        while (current && current.coords.key !== start) {
            pathArray.push(current);
            const next = path.get(current.coords.key);
            if (!next) {
                break;
            }
            current = next;
        }
        return pathArray;
    }
    function getGraphCost(path) {
        return Array.from(path.values()).reduce((acc, val) => acc + val.heat, 0);
    }
    function dijkstra(board) {
        const goal = new Coords(board.length - 1, board[0].length - 1);
        const priorityQueue = [];
        priorityQueue.push({ row: 0, col: 0, heat: 0, coords: new Coords(0, 0), move: 0 });
        const cameFrom = new Map();
        cameFrom.set(new Coords(0, 0).key, null);
        const costSoFar = new Map();
        costSoFar.set(new Coords(0, 0).key, 0);
        while (priorityQueue.length) {
            const current = priorityQueue.shift();
            console.log(`-------------------------------------------------------`);
            console.log(`current`, current);
            if (current.coords.key === goal.key) {
                console.log(`current`, current);
                break;
            }
            // reconstructPath(current.coords.key, new Coords(0, 0).key, cameFrom, board);
            const neighbors = getNeighbors(current.coords.row, current.coords.col, board, cameFrom);
            for (const neighbor of neighbors) {
                const tileCost = board[neighbor.row][neighbor.col];
                const newCost = costSoFar.get(current.coords.key) + tileCost + getGraphCost(getPath(current.coords.key, new Coords(0, 0).key, cameFrom));
                if ((!costSoFar.has(neighbor.key)) || (newCost < costSoFar.get(neighbor.key))) {
                    costSoFar.set(neighbor.key, newCost);
                    cameFrom.set(neighbor.key, Object.freeze(current));
                    priorityQueue.push({
                        row: neighbor.row,
                        col: neighbor.col,
                        heat: newCost,
                        coords: new Coords(neighbor.row, neighbor.col),
                        move: current.move + 1,
                    });
                    priorityQueue.sort((a, b) => a.heat - b.heat);
                }
            }
        }
        console.log(`DONE --------------------------------------`);
        reconstructPath(goal.key, new Coords(0, 0).key, cameFrom, board);
    }
    // bfs();
    dijkstra(structuredClone(originalBoard));
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map