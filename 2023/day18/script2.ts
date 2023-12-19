(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Location = { row: number, column: number };

    const coordinates: { row: number, column: number }[] = [];
    let previousCoordinates: { row: number, column: number } = {row: 0, column: 0};

    lines.forEach((line) => {
        const [direction, distance, color] = line.split(' ');
        const distanceInt = parseInt(color.substring(2, color.length - 2), 16);

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

    const coordinatesSet = new Set<string>();
    coordinates.forEach((c) => {
        coordinatesSet.add(`${c.row},${c.column}`);
    });

    // Display coordinates in grid
    // const grid: string[][] = [];
    // for (let i = 0; i <= gridRows; i++) {
    //     grid[i] = [];
    //     for (let j = 0; j <= gridColumns; j++) {
    //         grid[i][j] = coordinatesSet.has(`${i},${j}`) ? '#' : '.';
    //     }
    // }
    //
    // grid.forEach((row) => console.log(row.join('')));

    console.log(`coordinatesSet.size`, coordinatesSet.size);

    const checkTiles = new Set<string>();
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

    function getVisitedAtLocation(row: number, column: number, visited: Set<string>) {
        const currKey = `${row},${column}`;
        if (visited.has(currKey)) {
            return visited;
        }

        const queue: Location[] = [];
        queue.push({row, column});
        visited.add(currKey);

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

    const totalArea = (gridRows + 1) * (gridColumns + 1);
    console.log(`totalArea`, totalArea);

    let visited = new Set<string>();

    console.log(`checkTiles.size`, checkTiles.size);

    checkTiles.forEach((tile) => {
        const [row, column] = tile.split(',').map((n) => parseInt(n));
        visited = getVisitedAtLocation(row, column, visited);
    });

    console.log(`visited.size`, visited.size);

    console.log(`totalArea - visited.size`, totalArea - visited.size);

    // Trench is the number of # tiles
    const trench = coordinates.length;
    console.log(`trench`, trench);

    console.log(`Time:`, performance.now() - start);
})();
