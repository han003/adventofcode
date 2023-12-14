(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length).map((l) => l.split(''));
    const start = performance.now();
    const ROUNDROCK = 'O';
    const CUBEROCK = '#';
    const EMPTY = '.';
    const CYCLES = 1000; // 1_000_000_000;
    const NORTH = 1;
    const SOUTH = -1;
    const EAST = -1;
    const WEST = 1;

    function getPattern() {
        return lines.reduce((acc, line) => {
            return acc + line.join('');
        }, '');
    }

    function getSum() {
        return lines.reduce((acc, line, index, arr) => {
            const lineValue = arr.length - index;
            const lineItems = line.filter((x) => x === ROUNDROCK).length;
            return acc + lineValue * lineItems;
        }, 0);
    }

    function moveRoundRock(rowDirection: typeof NORTH | typeof SOUTH | 0, columnDirection: typeof WEST | typeof EAST | 0, row: number, col: number) {
        if (!lines[row - rowDirection]) {
            return;
        }

        if (lines[row - rowDirection][col - columnDirection] === EMPTY) {
            lines[row - rowDirection][col - columnDirection] = ROUNDROCK;
            lines[row][col] = EMPTY;
            moveRoundRock(rowDirection, columnDirection, row - rowDirection, col - columnDirection);
        }
    }

    const rows = lines.length;
    const columns = lines[0].length;

    for (let i = 0; i < CYCLES; i++) {
        // North
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (lines[row][col] !== ROUNDROCK) {
                    continue;
                }

                moveRoundRock(1, 0, row, col);
            }
        }

        // West
        for (let col = 0; col < columns; col++) {
            for (let row = 0; row < rows; row++) {
                if (lines[row][col] !== ROUNDROCK) {
                    continue;
                }

                moveRoundRock(0, 1, row, col);
            }
        }

        // South
        for (let row = rows - 1; row >= 0; row--) {
            for (let col = 0; col < columns; col++) {
                if (lines[row][col] !== ROUNDROCK) {
                    continue;
                }

                moveRoundRock(-1, 0, row, col);
            }
        }

        // East
        for (let col = columns - 1; col >= 0; col--) {
            for (let row = 0; row < rows; row++) {
                if (lines[row][col] !== ROUNDROCK) {
                    continue;
                }

                moveRoundRock(0, -1, row, col);
            }
        }

        if (getSum() === 64) {
            lines.forEach((line) => console.log(line.join('')));
            break;
        }
    }

    console.log(`time`, performance.now() - start);
})();
