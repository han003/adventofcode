(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Direction = 'R' | 'L' | 'D' | 'U';

    const dig: string[][] = [];
    const digIndex = 0;
    const coordinates: { row: number, column: number }[] = [];
    let previousDirection: Direction | null = null;
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

        previousDirection = direction as Direction;
    });

    console.log(`coordinates`, coordinates);

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

    console.log(`coordinates`, coordinates);

    const gridRows = Math.max(...coordinates.map((c) => c.row));
    console.log(`gridRows`, gridRows);

    const gridColumns = Math.max(...coordinates.map((c) => c.column));
    console.log(`gridColumns`, gridColumns);

    const grid: string[][] = new Array(gridRows + 1).fill('.').map(() => new Array(gridColumns + 1).fill('.'));
    console.log(`grid`, grid);

    coordinates.forEach((c) => {
        grid[c.row][c.column] = '#';
    });

    console.log(`coordinates`, coordinates);

    console.log(`grid`, grid);

    grid.forEach((row) => console.log(row.join('')));

    console.log(`Time:`, performance.now() - start);
})();
