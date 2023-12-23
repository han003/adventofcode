(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    function getKey(row: number, col: number): string {
        return `${row}:${col}`;
    }

    type Tile = {
        rock: boolean,
        garden: boolean,
        start: boolean,
        row: number,
        column: number,
        key: string,
        step: number,
    };

    const grid = lines.reduce((acc, row, rowIndex) => {
        row.split('').map((column, columnIndex) => {
            acc.set(getKey(rowIndex, columnIndex), {
                rock: lines[rowIndex].charAt(columnIndex) === '#',
                garden: lines[rowIndex].charAt(columnIndex) === '#',
                start: lines[rowIndex].charAt(columnIndex) === 'S',
                row: rowIndex,
                column: columnIndex,
                key: getKey(rowIndex, columnIndex),
                step: 0,
            });
        });

        return acc;
    }, new Map<string, Tile>());

    let queue = new Map<string, Tile>();
    const visited = new Set<string>();
    const stepInfo = new Map<string, number>();

    const startTile = Array.from(grid).find(([_, tile]) => tile.start)?.[1];
    if (!startTile) {
        throw new Error(`No start tile found`);
    }

    queue.set(startTile.key, startTile);

    let maxSteps = 64;

    for (let i = 0; i < maxSteps; i++) {
        const nextQueue = new Map<string, Tile>();

        queue.forEach((tile) => {
            const neighbours = [
                grid.get(getKey(tile.row - 1, tile.column)),
                grid.get(getKey(tile.row + 1, tile.column)),
                grid.get(getKey(tile.row, tile.column - 1)),
                grid.get(getKey(tile.row, tile.column + 1)),
            ];

            neighbours.forEach((neighbour) => {
                if (!neighbour) {
                    return;
                }

                if (neighbour.rock) {
                    return;
                }

                neighbour.step = tile.step + 1;
                nextQueue.set(neighbour.key, neighbour);
            });
        });

        queue = nextQueue;
    }

    console.log(`queue`, queue.size);

    console.log(`Time:`, performance.now() - start);
})();
