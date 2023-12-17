(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const board = lines.map(l => l.split('').map(s => parseInt(s)));
    let activeEmitters = 0;
    let currentLowest = Infinity;
    let iterations = 0;

    class Emitter {
        constructor(
            private board: number[][],
            private row: number,
            private column: number,
            private sum: number,
            private path: string[],
            private largestRow: number,
            private largestColumn: number,
        ) {
            activeEmitters++;
            iterations++;

            if (row === board.length - 1 && column === board[0].length) {
                // console.log(`DONE THIS`, this.sum);
                // console.log(`row`, row);
                // console.log(`column`, column);
                if (this.sum < currentLowest) {
                    currentLowest = this.sum;
                    this.drawPath();
                }

                activeEmitters--;
                return;
            }

            const tileValue = board[row]?.[column];
            if (tileValue == null) {
                // console.log(`No tile`,);
                activeEmitters--;
                return;
            }

            if (this.hasVisited(this.getTileKey())) {
                // console.log(`already visited`, this.getTileKey());
                activeEmitters--;
                return
            }

            if (row < largestRow && (largestRow - row) > 1) {
                // console.log(`too far up`);
                activeEmitters--;
                return;
            }

            if (column < largestColumn && (largestColumn - column) > 1) {
                // console.log(`too far left`);
                activeEmitters--;
                return;
            }

            if (this.sum >= currentLowest) {
                // console.log(`sum will exceed`);
                activeEmitters--;
                return;
            }

            const newSum = sum + tileValue;

            // console.log(`this`, this);
            // console.log(`activeEmitters`, activeEmitters);


            if (iterations > 100_000_000) {
                console.log(`max iterations`,);
                return;
            }


            if (this.canGoLeft) {
                new Emitter(
                    board,
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
                    board,
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
                    board,
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
                    board,
                    row - 1,
                    column,
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    this.largestColumn,
                );
            }

            activeEmitters--;
        }

        drawPath() {
            const path = this.path;
            const board: (number | string)[][] = structuredClone(this.board);

            path.forEach((tileKey) => {
                const [row, column] = tileKey.split(',').map(s => parseInt(s));
                board[row][column] = '.';
            });

            console.group('Path, ' + this.sum);
            board.forEach((row) => {
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
            return !this.hasThreeLeftPrevious;
        }

        get canGoRight() {
            const hasAbove = this.hasVisited(this.getTileKey(this.row - 1, this.column));
            const hasAboveRight = this.hasVisited(this.getTileKey(this.row - 1, this.column + 1));
            return !this.hasThreeRightPrevious;
        }

        get canGoUp() {
            const hasLeft = this.hasVisited(this.getTileKey(this.row, this.column - 1));
            const hasAboveLeft = this.hasVisited(this.getTileKey(this.row - 1, this.column - 1));
            return !this.hasThreeUpPrevious;
        }

        get canGoDown() {
            const hasLeft = this.hasVisited(this.getTileKey(this.row, this.column - 1));
            const hasBelowLeft = this.hasVisited(this.getTileKey(this.row + 1, this.column - 1));
            return !this.hasThreeDownPrevious;
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

    new Emitter(board, 0, 0, -board[0][0], [], 0, 0);

    console.log(`Lowest:`, currentLowest);
    console.log(`Iterations:`, iterations);
    console.log(`Active emitters:`, activeEmitters);
    console.log(`Time:`, performance.now() - start);
})();
