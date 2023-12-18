(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const board = lines.map((l) => l.split('').map((s) => parseInt(s)));

    function getNeighbors([ row, col ]: number[]) {
        const neighbors: number[][] = [];

        // Up
        if (board[row + 1]?.[col] != null) {
            neighbors.push([ row + 1, col ]);
        }

        // Down
        if (board[row - 1]?.[col] != null) {
            neighbors.push([ row - 1, col ]);
        }

        // Left
        if (board[row]?.[col - 1] != null) {
            neighbors.push([ row, col - 1 ]);
        }

        // Right
        if (board[row]?.[col + 1] != null) {
            neighbors.push([ row, col + 1 ]);
        }

        return neighbors;
    }

    function reconstructPath(goal: string, start: string, path: Map<string, string>, board: (number | string)[][]) {
        console.log(`goal`, goal);
        console.log(`start`, start);
        console.log(`path`, path);

        const boardCopy = structuredClone(board);
        let current = goal;

        while (current !== start) {
            const currentCoords = current.split(',').map((n) => parseInt(n));
            boardCopy[currentCoords[0]][currentCoords[1]] = 'X';
            current = path.get(current)!;
        }

        boardCopy.forEach((row) => console.log(row.join(' ')));
    }

    function dijkstra() {
        const goal = [ board.length - 1, board[0].length - 1 ];
        // const goal = [ 5, 11 ];

        const priorityQueue: { row: number, col: number, priority: number, coords: string }[] = [];
        priorityQueue.push({ row: 0, col: 0, priority: 0, coords: [ 0, 0 ].toString() });
        const cameFrom = new Map<string, string>();
        cameFrom.set([ 0, 0 ].toString(), '');
        const costSoFar = new Map<string, number>();
        costSoFar.set([ 0, 0 ].toString(), 0);

        while (priorityQueue.length) {
            const queue = priorityQueue.sort((a, b) => a.priority - b.priority);
            const current = queue.shift()!;

            if (current.coords === goal.toString()) {
                break;
            }

            const neighbors = getNeighbors([ current.row, current.col ]);
            for (const neighbor of neighbors) {
                const newCost = costSoFar.get(current.coords)! + board[neighbor[0]][neighbor[1]];

                if (!costSoFar.has(neighbor.toString()) || newCost < costSoFar.get(neighbor.toString())!) {
                    costSoFar.set(neighbor.toString(), newCost);
                    priorityQueue.push({ row: neighbor[0], col: neighbor[1], priority: newCost, coords: neighbor.toString() });
                    cameFrom.set(neighbor.toString(), current.coords);
                }
            }
        }

        reconstructPath(goal.toString(), [ 0, 0 ].toString(), cameFrom, board);
    }

    function bfs() {
        // const target = [ board.length - 1, board[0].length - 1 ];
        const goal = [ 5, 11 ];

        const front: number[][] = [];
        front.push([ 0, 0 ]);
        const cameFrom = new Map<string, string>();
        cameFrom.set([ 0, 0 ].toString(), '');

        while (front.length) {
            const current = front.shift()!;
            const neighbors = getNeighbors(current);

            if (current.toString() === goal.toString()) {
                break;
            }

            for (const neighbor of neighbors) {
                if (!cameFrom.has(neighbor.toString())) {
                    front.push(neighbor);
                    cameFrom.set(neighbor.toString(), current.toString());
                }
            }
        }

        reconstructPath(goal.toString(), [ 0, 0 ].toString(), cameFrom, board);
    }

    // bfs();
    dijkstra();

    console.log(`Time:`, performance.now() - start);
})();
