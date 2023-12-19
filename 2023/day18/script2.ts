(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Location = { row: number, column: number };

    const coordinates: { row: number, column: number }[] = [];
    let previousCoordinates: { row: number, column: number } = {row: 0, column: 0};

    lines.forEach((line) => {
        const [direction, distance, color] = line.split(' ');
        const distanceInt = parseInt(distance);

        let movement: { row: number, column: number } = {row: 0, column: 0};

        if (direction === 'R') {
            movement = {row: 0, column: 1};
        }
        if (direction === 'L') {
            movement = {row: 0, column: -1};
        }
        if (direction === 'U') {
            movement = {row: -1, column: 0};
        }
        if (direction === 'D') {
            movement = {row: 1, column: 0};
        }

        for (let i = 0; i < distanceInt; i++) {
            const newCoordinates = {row: previousCoordinates.row + movement.row, column: previousCoordinates.column + movement.column};
            coordinates.push(newCoordinates);
            previousCoordinates = newCoordinates;
        }
    });

    const maxRight = Math.max(...coordinates.map((c) => c.column));
    console.log(`maxRight`, maxRight);

    const maxLeft = Math.abs(Math.min(...coordinates.map((c) => c.column)));
    console.log(`maxLeft`, maxLeft);

    const maxUp = Math.abs(Math.min(...coordinates.map((c) => c.row)));
    console.log(`maxUp`, maxUp);

    const maxDown = Math.max(...coordinates.map((c) => c.row));
    console.log(`maxDown`, maxDown);

    coordinates.forEach((c) => {
        c.column += maxLeft;
        c.row += maxUp;
    });

    const gridRows = Math.max(...coordinates.map((c) => c.row));
    console.log(`gridRows`, gridRows);

    const gridColumns = Math.max(...coordinates.map((c) => c.column));
    console.log(`gridColumns`, gridColumns);

    const checkTiles: Location[] = [];
    // Top row
    for (let i = 0; i < gridColumns; i++) {
        const found = coordinates.find(c => c.row === 0 && c.column === i);
        if (!found) {
            checkTiles.push({row: 0, column: i});
        }
    }

    // Bottom row
    for (let i = 0; i < gridColumns; i++) {
        const found = coordinates.find(c => c.row === gridRows && c.column === i);
        if (!found) {
            checkTiles.push({row: gridRows, column: i});
        }
    }

    // Left column
    for (let i = 0; i < gridRows; i++) {
        const found = coordinates.find(c => c.row === i && c.column === 0);
        if (!found) {
            checkTiles.push({row: i, column: 0});
        }
    }

    // Right column
    for (let i = 0; i < gridRows; i++) {
        const found = coordinates.find(c => c.row === i && c.column === gridColumns);
        if (!found) {
            checkTiles.push({row: i, column: gridColumns});
        }
    }

    function getVisitedAtLocation(row: number, column: number, visited: Set<string>) {
        if (visited.has(`${row},${column}`)) {
            return visited;
        }

        const queue: Location[] = [];
        queue.push({row, column});
        visited.add(`${row},${column}`);

        while (queue.length) {
            const current = queue.shift()!;
            const {row, column} = current;

            const neighbors: Location[] = [
                {row: row - 1, column},
                {row: row + 1, column},
                {row, column: column - 1},
                {row, column: column + 1},
            ];

            neighbors.forEach((neighbor) => {
                const {row, column} = neighbor;

                if (row < 0 || column < 0 || row >= gridRows || column >= gridColumns) {
                    return;
                }

                const isTrench = coordinates.find((c) => c.row === row && c.column === column);

                if (!isTrench && !visited.has(`${row},${column}`)) {
                    queue.push(neighbor);
                    visited.add(`${row},${column}`);
                }
            });
        }

        return visited;
    }

    let visited = new Set<string>();
    checkTiles.forEach((tile) => {
        visited = getVisitedAtLocation(tile.row, tile.column, visited);
    });

    console.log(`visited.size`, visited.size);

    const totalArea = (gridRows + 1) * (gridColumns + 1);
    console.log(`totalArea`, totalArea);

    console.log(`totalArea - visited.size`, totalArea - visited.size);

    // Trench is the number of # tiles
    const trench = coordinates.length;
    console.log(`trench`, trench);

    const inside = 0;// grid.reduce((acc, row) => acc + row.filter((tile) => tile === '.').length, 0);
    console.log(`inside`, inside);
    console.log(`trench + inside`, trench + inside);

    console.log(`Time:`, performance.now() - start);
})();
