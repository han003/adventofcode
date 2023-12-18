(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const board = lines.map((l) => l.split('').map((s) => parseInt(s)));

    function getNeighbors(coords: Coords) {
        const neighbors: Coords[] = [];

        // Up
        if (board[coords.row + 1]?.[coords.col] != null) {
            neighbors.push(new Coords(coords.row + 1, coords.col));
        }

        // Down
        if (board[coords.row - 1]?.[coords.col] != null) {
            neighbors.push(new Coords(coords.row - 1, coords.col));
        }

        // Left
        if (board[coords.row]?.[coords.col - 1] != null) {
            neighbors.push(new Coords(coords.row, coords.col - 1));
        }

        // Right
        if (board[coords.row]?.[coords.col + 1] != null) {
            neighbors.push(new Coords(coords.row, coords.col + 1));
        }

        return neighbors;
    }

    function reconstructPath(goal: string, start: string, path: Map<string, string>, board: (number | string)[][]) {
        const boardCopy = structuredClone(board);
        let current = goal;

        while (current !== start) {
            const currentCoords = current.split(',').map((n) => parseInt(n));
            boardCopy[currentCoords[0]][currentCoords[1]] = 'X';
            current = path.get(current)!;
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
        // const goal = [ 5, 11 ];

        const priorityQueue: { row: number, col: number, priority: number, coords: Coords }[] = [];
        priorityQueue.push({ row: 0, col: 0, priority: 0, coords: new Coords(0, 0) });
        const cameFrom = new Map<string, string>();
        cameFrom.set(new Coords(0, 0).key, '');
        const costSoFar = new Map<string, number>();
        costSoFar.set(new Coords(0, 0).key, 0);

        while (priorityQueue.length) {
            const queue = priorityQueue.sort((a, b) => a.priority - b.priority);
            const current = queue.shift()!;

            if (current.coords.key === goal.key) {
                break;
            }

            const neighbors = getNeighbors(current.coords);
            for (const neighbor of neighbors) {
                const newCost = costSoFar.get(current.coords.key)! + board[neighbor.row][neighbor.col];

                if (!costSoFar.has(neighbor.key) || newCost < costSoFar.get(neighbor.toString())!) {
                    costSoFar.set(neighbor.key, newCost);
                    priorityQueue.push({ row: neighbor.row, col: neighbor.col, priority: newCost, coords: neighbor });
                    cameFrom.set(neighbor.key, current.coords.key);
                }
            }
        }

        reconstructPath(goal.key, new Coords(0, 0).key, cameFrom, board);
    }

    // bfs();
    dijkstra();

    console.log(`Time:`, performance.now() - start);
})();
