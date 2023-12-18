(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const originalBoard = lines.map((l) => l.split('').map((s) => parseInt(s)));

    interface QueueEntry {
        row: number,
        col: number,
        priority: number,
        coords: Coords,
    }

    function getNeighbors(coords: Coords, board: number[][]) {
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

    function reconstructPath(goal: string, start: string, path: Map<string, QueueEntry | null>, board: (number | string)[][]) {
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
        constructor(public row: number, public col: number) {
        }

        get key() {
            return `${this.row},${this.col}`;
        }
    }

    function getPath(goal: string, start: string, path: Map<string, QueueEntry | null>) {
        const pathArray: QueueEntry[] = [];
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

    function getGraphCost(board: number[][], path: QueueEntry[]) {
        let cost = 0;
        let current = path.shift();
        while (current) {
            cost += board[current.row][current.col];
            current = path.shift();
        }

        return cost;
    }

    function getLastThree(coords: Coords, path: Map<string, QueueEntry | null>) {
        const pathArray: QueueEntry[] = [];
        let current = path.get(coords.key);
        if (!current) {
            return [];
        }

        while (current && pathArray.length < 3) {
            pathArray.push(current);
            const next = path.get(current.coords.key);
            if (!next) {
                break;
            }

            current = next;
        }

        return pathArray.length === 3 ? pathArray : null;
    }

    function heuristic(a: Coords, b: Coords) {
        // From top left to bottom right
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    function dijkstra(board: number[][]) {
        const goal = new Coords(board.length - 1, board[0].length - 1);
        let i = 0;
        console.log('---------------------------------------------------');
        board.forEach((row) => console.log(row.join(' ')));

        const priorityQueue: QueueEntry[] = [];
        priorityQueue.push({ row: 0, col: 0, priority: 0, coords: new Coords(0, 0) });
        const cameFrom = new Map<string, QueueEntry | null>();
        cameFrom.set(new Coords(0, 0).key, null);
        const costSoFar = new Map<string, number>();
        costSoFar.set(new Coords(0, 0).key, 0);

        while (priorityQueue.length && i < 200_000) {
            i++;
            const current = priorityQueue.shift()!;

            if (current.coords.key === goal.key) {
                break;
            }

            const neighbors = getNeighbors(current.coords, board);
            for (const neighbor of neighbors) {
                console.log(`--------------------------------`);
                console.log(`neighbor`, neighbor);
                const lastThree = getLastThree(neighbor, cameFrom);

                const lastThreeAreSame = !!lastThree?.length && lastThree?.every((c) => c.row === neighbor.row || c.col === neighbor.col);

                if (lastThreeAreSame) {
                    console.log(`lastThree`, lastThree);
                    console.log(`neighbor`, neighbor, board[neighbor.row][neighbor.col]);
                }

                const tileCost = board[neighbor.row][neighbor.col];
                // console.log(`-----------------------------------------------`, );
                // console.log(`costSoFar.get(current.coords.key)!`, costSoFar.get(current.coords.key)!);
                // console.log(`tile`, tileCost);
                const graphCost = getGraphCost(board, getPath(current.coords.key, new Coords(0, 0).key, cameFrom));
                // console.log(`graphCost`, graphCost);

                const newCost = costSoFar.get(current.coords.key)! + tileCost + graphCost;

                console.log(`doesnt have neighbor`, !costSoFar.has(neighbor.key));
                console.log(`new cost is less`, newCost < costSoFar.get(neighbor.key)!, newCost);

                if (!costSoFar.has(neighbor.key) || newCost < costSoFar.get(neighbor.key)!) {
                    console.log(`add`, neighbor);
                    costSoFar.set(neighbor.key, newCost);
                    cameFrom.set(neighbor.key, current);

                    priorityQueue.push({
                        row: neighbor.row,
                        col: neighbor.col,
                        priority: newCost + (lastThreeAreSame ? 1000 : 0),
                        // priority: newCost + heuristic(neighbor, goal),
                        coords: neighbor,
                    });

                    priorityQueue.sort((a, b) => a.priority - b.priority);

                    priorityQueue.forEach((q) => console.log(q.coords.key, q.priority));
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
