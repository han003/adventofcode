(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const board = lines.map((l) => l.split('').map((s) => parseInt(s)));

    type Direction = 'left' | 'right' | 'up' | 'down';

    interface PriorityQueue {
        row: number,
        col: number,
        priority: number,
        coords: Coords,
        direction: Direction,
    }

    function getNeighbors(coords: Coords) {
        const neighbors: { coords: Coords, direction: Direction }[] = [];

        // Up
        if (board[coords.row + 1]?.[coords.col] != null) {
            neighbors.push({
                coords: new Coords(coords.row + 1, coords.col),
                direction: 'up',
            });
        }

        // Down
        if (board[coords.row - 1]?.[coords.col] != null) {
            neighbors.push({
                coords: new Coords(coords.row - 1, coords.col),
                direction: 'down',
            });
        }

        // Left
        if (board[coords.row]?.[coords.col - 1] != null) {
            neighbors.push({
                coords: new Coords(coords.row, coords.col - 1),
                direction: 'left',
            });
        }

        // Right
        if (board[coords.row]?.[coords.col + 1] != null) {
            neighbors.push({
                coords: new Coords(coords.row, coords.col + 1),
                direction: 'right',
            });
        }

        return neighbors;
    }

    function reconstructPath(goal: string, start: string, path: Map<string, PriorityQueue | null>, board: (number | string)[][]) {
        const boardCopy = structuredClone(board);
        let current = goal;

        while (current !== start) {
            const currentCoords = current.split(',').map((n) => parseInt(n));
            boardCopy[currentCoords[0]][currentCoords[1]] = 'X';

            const next = path.get(current)?.coords.key;
            if (!next) {
                break;
            }

            current = next;
        }

        boardCopy.forEach((row) => console.log(row.join(' ')));
    }

    class Coords {
        constructor(public row: number, public col: number) {
        }

        get key() {
            return `${this.row},${this.col}`;
        }
    }

    function dijkstra() {
        const goal = new Coords(board.length - 1, board[0].length - 1);

        const priorityQueue: PriorityQueue[] = [];
        priorityQueue.push({ row: 0, col: 0, priority: 0, coords: new Coords(0, 0), direction: 'right' });
        const cameFrom = new Map<string, PriorityQueue | null>();
        cameFrom.set(new Coords(0, 0).key, null);
        const costSoFar = new Map<string, number>();
        costSoFar.set(new Coords(0, 0).key, 0);

        while (priorityQueue.length) {
            const current = priorityQueue.shift()!;

            if (current.coords.key === goal.key) {
                break;
            }

            const neighbors = getNeighbors(current.coords);
            for (const neighbor of neighbors) {
                const tileCost = board[neighbor.coords.row][neighbor.coords.col];
                const newCost = costSoFar.get(current.coords.key)! + tileCost;

                if (!costSoFar.has(neighbor.coords.key) || newCost < costSoFar.get(neighbor.toString())!) {
                    costSoFar.set(neighbor.coords.key, newCost);
                    const priority = newCost;
                    cameFrom.set(neighbor.coords.key, current);

                    priorityQueue.push({ row: neighbor.coords.row, col: neighbor.coords.col, priority, coords: neighbor.coords, direction: neighbor.direction });
                    priorityQueue.sort((a, b) => a.priority - b.priority);
                }
            }
        }

        reconstructPath(goal.key, new Coords(0, 0).key, cameFrom, board);
    }

    // bfs();
    dijkstra();

    console.log(`Time:`, performance.now() - start);
})();
