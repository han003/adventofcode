(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const graph = lines.reduce((acc, row, rowIndex) => {
        row.split('').map((column, columnIndex) => {
            acc.set(getKey(rowIndex, columnIndex), {
                heat: Number(column),
                row: rowIndex,
                column: columnIndex,
                key: getKey(rowIndex, columnIndex),
                goal: rowIndex === lines.length - 1 && columnIndex === row.length - 1,
            });
        });

        return acc;
    }, new Map<string, Block>());

    function getKey(row: number, col: number): string {
        return `${row}:${col}`;
    }

    function move(tryDirection: 'left' | 'right' | 'straight', state: State) {
        const {row, column, heat, distance, direction} = state;

        let nextDirection = direction;
        let nextCol = 0;
        let nextRow = 0;

        if (state.direction === 'right') {
            if (tryDirection === 'left') {
                nextCol = column;
                nextRow = row - 1;
                nextDirection = 'up';
            }
            if (tryDirection === 'right') {
                nextCol = column;
                nextRow = row + 1;
                nextDirection = 'down';
            }
            if (tryDirection === 'straight') {
                nextCol = column + 1;
                nextRow = row;
            }
        }

        if (state.direction === 'down') {
            if (tryDirection === 'left') {
                nextCol = column + 1;
                nextRow = row;
                nextDirection = 'right';
            }
            if (tryDirection === 'right') {
                nextCol = column - 1;
                nextRow = row;
                nextDirection = 'left';
            }
            if (tryDirection === 'straight') {
                nextCol = column;
                nextRow = row + 1;
            }
        }

        if (state.direction === 'left') {
            if (tryDirection === 'left') {
                nextCol = column;
                nextRow = row + 1;
                nextDirection = 'down';
            }
            if (tryDirection === 'right') {
                nextCol = column;
                nextRow = row - 1;
                nextDirection = 'up';
            }
            if (tryDirection === 'straight') {
                nextCol = column - 1;
                nextRow = row;
            }
        }

        if (state.direction === 'up') {
            if (tryDirection === 'left') {
                nextCol = column - 1;
                nextRow = row;
                nextDirection = 'left';
            }
            if (tryDirection === 'right') {
                nextCol = column + 1;
                nextRow = row;
                nextDirection = 'right';
            }
            if (tryDirection === 'straight') {
                nextCol = column;
                nextRow = row - 1;
            }
        }

        const next = graph.get(getKey(nextRow, nextCol));
        if (next) {
            const newState: State = {
                column: next.column,
                row: next.row,
                heat: heat + next.heat,
                distance: tryDirection === 'straight' ? distance + 1 : 1,
                direction: nextDirection,
                path: [...state.path, state],
            }


            if (next.goal) {
                endState = newState;
                return;
            }

            if (heat === 4) {
                console.log(`state`, state);
            }

            const seenKey = getSeenKey(newState);
            if (!seen.has(seenKey)) {
                seen.set(seenKey, newState.heat);
                queue.push(newState);
            }
        }
    }

    function getSeenKey(state: State): string {
        return `${state.row}:${state.column}:${state.direction}:${state.distance}`;
    }

    type Block = { heat: number, row: number, column: number, key: string, goal: boolean };

    type State = { row: number, column: number, heat: number, distance: number, direction: 'left' | 'right' | 'up' | 'down', path: State[] };

    console.log(`graph`, graph);

    let endState: State | null = null;
    let queue: State[] = [];
    const seen = new Map<string, number>();

    queue.push({row: 0, column: 0, heat: 0, distance: 0, direction: 'right', path: []});
    queue.push({row: 0, column: 0, heat: 0, distance: 0, direction: 'down', path: []});

    while (!endState && queue.length) {
        queue.sort((a, b) => a.heat - b.heat);

        const state = queue.shift()!;
        const {row, column, heat, distance, direction} = state;

        move('left', state);
        move('right', state);

        if (distance < 3) {
            move('straight', state);
        }
    }

    console.log(`endState`, endState);

    endState!.path.forEach((state) => {
        console.log(state.row, state.column, state.direction);
    });

    console.log(`endState!.heat`, endState!.heat);

    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            const isPath = endState!.path.some((state) => state.row === row && state.column === col);
            const isEnd = endState!.row === row && endState!.column === col;

            if (isPath || isEnd) {
                process.stdout.write(`\x1b[31m${lines[row][col]}\x1b[0m`);
            } else {
                process.stdout.write(lines[row][col]);
            }
        }

        process.stdout.write('\n');
    }

    console.log(`Time:`, performance.now() - start);
})();
