(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const board = lines.map(l => l.split('').map(s => parseInt(s)));
    let currentLowest = Infinity;
    let iterations = 0;

    class Emitter {
        constructor(
            private row: number,
            private column: number,
            private sum: number,
            private path: string[],
            private largestRow: number,
            private largestColumn: number,
        ) {
            iterations++;

            if (row === board.length - 1 && column === board[0].length) {
                if (this.sum < currentLowest) {
                    currentLowest = this.sum;
                    this.drawPath();
                }

                return;
            }

            const tileValue = board[row]?.[column];
            if (tileValue == null) {
                return;
            }

            if (this.hasVisited(this.getTileKey())) {
                return
            }

            if (row < largestRow && (largestRow - row) > 1) {
                return;
            }

            if (column < largestColumn && (largestColumn - column) > 1) {
                return;
            }

            if (this.sum >= currentLowest) {
                return;
            }

            const newSum = sum + tileValue;
            if (this.canGoLeft) {
                new Emitter(
                    row,
                    column - 1,
                    newSum,
                    path.concat(this.getTileKey()),
                    this.largestRow,
                    Math.max(this.largestColumn, column),
                );
            }

            if (this.canGoDown) {
                new Emitter(
                    row + 1,
                    column,
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    this.largestColumn,
                );
            }

            if (this.canGoRight) {
                new Emitter(
                    row,
                    column + 1,
                    newSum,
                    path.concat(this.getTileKey()),
                    this.largestRow,
                    Math.max(this.largestColumn, column),
                );
            }

            if (this.canGoUp) {
                new Emitter(
                    row - 1,
                    column,
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    this.largestColumn,
                );
            }
        }

        drawPath() {
            const path = this.path;
            const clonedBoard: (number | string)[][] = structuredClone(board);

            path.forEach((tileKey) => {
                const [row, column] = tileKey.split(',').map(s => parseInt(s));
                clonedBoard[row][column] = '.';
            });

            console.group('Path, ' + this.sum);
            clonedBoard.forEach((row) => {
                console.log(row.join(''));
            });
            console.groupEnd();
        }

        getTileKey(row?: number, column?: number) {
            return `${row ?? this.row},${column ?? this.column}`;
        }

        hasVisited(key: string) {
            return this.path.includes(key);
        }

        get canGoLeft() {
            const hasAbove = this.hasVisited(this.getTileKey(this.row - 1, this.column));
            const hasAboveLeft = this.hasVisited(this.getTileKey(this.row - 1, this.column - 1));
            return !this.hasThreeLeftPrevious && !(hasAbove && hasAboveLeft);
        }

        get canGoRight() {
            const hasAbove = this.hasVisited(this.getTileKey(this.row - 1, this.column));
            const hasAboveRight = this.hasVisited(this.getTileKey(this.row - 1, this.column + 1));
            return !this.hasThreeRightPrevious && !(hasAbove && hasAboveRight);
        }

        get canGoUp() {
            const hasLeft = this.hasVisited(this.getTileKey(this.row, this.column - 1));
            const hasAboveLeft = this.hasVisited(this.getTileKey(this.row - 1, this.column - 1));
            return !this.hasThreeUpPrevious && !(hasLeft && hasAboveLeft);
        }

        get canGoDown() {
            const hasLeft = this.hasVisited(this.getTileKey(this.row, this.column - 1));
            const hasBelowLeft = this.hasVisited(this.getTileKey(this.row + 1, this.column - 1));
            return !this.hasThreeDownPrevious && !(hasLeft && hasBelowLeft);
        }

        get hasThreeRightPrevious() {
            return this.hasVisited(this.getTileKey(this.row, this.column - 1)) && this.hasVisited(this.getTileKey(this.row, this.column - 2)) && this.hasVisited(this.getTileKey(this.row, this.column - 3));
        }

        get hasThreeDownPrevious() {
            return this.hasVisited(this.getTileKey(this.row - 1, this.column)) && this.hasVisited(this.getTileKey(this.row - 2, this.column)) && this.hasVisited(this.getTileKey(this.row - 3, this.column));
        }

        get hasThreeUpPrevious() {
            return this.hasVisited(this.getTileKey(this.row + 1, this.column)) && this.hasVisited(this.getTileKey(this.row + 2, this.column)) && this.hasVisited(this.getTileKey(this.row + 3, this.column));
        }

        get hasThreeLeftPrevious() {
            return this.hasVisited(this.getTileKey(this.row, this.column + 1)) && this.hasVisited(this.getTileKey(this.row, this.column + 2)) && this.hasVisited(this.getTileKey(this.row, this.column + 3));
        }
    }

    new Emitter(0, 0, -board[0][0], [], 0, 0);

    console.log(`Lowest:`, currentLowest);
    console.log(`Iterations:`, iterations);
    console.log(`Time:`, performance.now() - start);
})();
