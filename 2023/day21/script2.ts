(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Tile = {
        rock: boolean,
        garden: boolean,
        start: boolean,
        row: number,
        column: number,
        key: string,
        infinityRow: number;
        infinityColumn: number;
    };

    type TileData = { row: number, column: number, cameFromRow: number, cameFromColumn: number };

    function getKey(row: number, column: number) {
        return `${row},${column}`;
    }

    const grid = lines.reduce((acc, row, rowIndex) => {
        row.split('').map((_, columnIndex) => {
            acc.set(getKey(rowIndex, columnIndex), {
                rock: lines[rowIndex].charAt(columnIndex) === '#',
                garden: lines[rowIndex].charAt(columnIndex) === '#',
                start: lines[rowIndex].charAt(columnIndex) === 'S',
                row: rowIndex,
                column: columnIndex,
                key: getKey(rowIndex, columnIndex),
                infinityRow: 0,
                infinityColumn: 0,
            });
        });

        return acc;
    }, new Map<string, Tile>());

    const gridRows = lines.length;
    const gridColumns = lines[0].length;

    const rocks = Array.from(grid).filter(([_, tile]) => tile.rock).reduce((acc, [_, tile]) => {
        acc[tile.row] = acc[tile.row] || {};
        acc[tile.row][tile.column] = true;
        return acc;
    }, {} as Record<number, Record<number, true>>);

    console.log(`rocks`, rocks);

    let queue: TileData[] = [];

    const startTile = Array.from(grid).find(([_, tile]) => tile.start)?.[1];
    if (!startTile) {
        throw new Error(`No start tile found`);
    }

    queue.push({row: startTile.row, column: startTile.column, cameFromRow: -1, cameFromColumn: -1});

    let maxSteps = 50;
    let reachable = 0;
    const reachableTiles = new Set<string>();

    for (let i = 0; i <= maxSteps; i++) {
        const nextQueue: TileData[] = [];
        const canReach = (i % 2) === 0 ? 1 : 0;

        console.log(`i`, i);

        queue.forEach((tile) => {
            if (canReach) {
                reachableTiles.add(`${tile.row},${tile.column}`);
            }

            const neighbours = [
                {row: tile.row, column: tile.column - 1, cameFromRow: tile.row, cameFromColumn: tile.column},
                {row: tile.row, column: tile.column + 1, cameFromRow: tile.row, cameFromColumn: tile.column},
                {row: tile.row - 1, column: tile.column, cameFromRow: tile.row, cameFromColumn: tile.column},
                {row: tile.row + 1, column: tile.column, cameFromRow: tile.row, cameFromColumn: tile.column},
            ];

            neighbours.forEach((neighbour) => {
                if (tile.cameFromColumn === neighbour.column && tile.cameFromRow === neighbour.row) {
                    return;
                }

                const realColumn = neighbour.column < 0 ? (neighbour.column % gridColumns) + gridColumns : neighbour.column % gridColumns;
                const realRow = neighbour.row < 0 ? (neighbour.row % gridRows) + gridRows : neighbour.row % gridRows;

                if (rocks[realRow]?.[realColumn]) {
                    return;
                }

                nextQueue.push(neighbour);
            });
        });

        queue = nextQueue;

        // console.log(`After ${i} -----------------------------------------`,);
        //
        // for (let i = 0; i < lines.length; i++) {
        //     for (let j = 0; j < lines[i].length; j++) {
        //         const char = lines[i].charAt(j);
        //         if (char === 'S') {
        //             process.stdout.write('S');
        //         } else if (char === '#') {
        //             process.stdout.write('#');
        //         } else if (reachableTiles.has(getKey(i, j))) {
        //             process.stdout.write('0');
        //         } else {
        //             process.stdout.write('.');
        //         }
        //     }
        //
        //     process.stdout.write('\n');
        // }
    }

    console.log(`Reach`, reachableTiles.size);

    console.log(`reachable`, reachable);

    console.log(`Time:`, performance.now() - start);
})();
