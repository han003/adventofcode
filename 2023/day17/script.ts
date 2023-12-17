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
            private visited: Map<string, number>,
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

            if (visited.has(this.getTileKey())) {
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
            visited.set(this.getTileKey(), tileValue);

            // console.log(`this`, this);
            // console.log(`activeEmitters`, activeEmitters);


            if (iterations > 100_000_000) {
                // this.drawPath();
                return;
            }

            if (this.canGoLeft) {
                new Emitter(
                    board,
                    row,
                    column - 1,
                    new Map(visited),
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    Math.max(this.largestColumn, column),
                );
            }

            if (this.canGoRight) {
                new Emitter(
                    board,
                    row,
                    column + 1,
                    new Map(visited),
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    Math.max(this.largestColumn, column),
                );
            }

            if (this.canGoDown) {
                new Emitter(
                    board,
                    row + 1,
                    column,
                    new Map(visited),
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    Math.max(this.largestColumn, column),
                );
            }

            if (this.canGoUp) {
                new Emitter(
                    board,
                    row - 1,
                    column,
                    new Map(visited),
                    newSum,
                    path.concat(this.getTileKey()),
                    Math.max(this.largestRow, row),
                    Math.max(this.largestColumn, column),
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

            console.group('Path');
            board.forEach((row) => {
                console.log(row.join(''));
            });
            console.groupEnd();
        }

        getTileKey(row?: number, column?: number) {
            return `${row ?? this.row},${column ?? this.column}`;
        }

        get canGoLeft() {
            const hasAbove = this.visited.has(this.getTileKey(this.row - 1, this.column));
            const hasAboveLeft = this.visited.has(this.getTileKey(this.row - 1, this.column - 1));
            return !this.hasThreeLeftPrevious && !(hasAbove && hasAboveLeft);
        }

        get canGoRight() {
            const hasAbove = this.visited.has(this.getTileKey(this.row - 1, this.column));
            const hasAboveRight = this.visited.has(this.getTileKey(this.row - 1, this.column + 1));
            return !this.hasThreeRightPrevious && !(hasAbove && hasAboveRight);
        }

        get canGoUp() {
            const hasLeft = this.visited.has(this.getTileKey(this.row, this.column - 1));
            const hasAboveLeft = this.visited.has(this.getTileKey(this.row - 1, this.column - 1));
            return !this.hasThreeUpPrevious && !(hasLeft && hasAboveLeft);
        }

        get canGoDown() {
            const hasLeft = this.visited.has(this.getTileKey(this.row, this.column - 1));
            const hasBelowLeft = this.visited.has(this.getTileKey(this.row + 1, this.column - 1));
            return !this.hasThreeDownPrevious && !(hasLeft && hasBelowLeft);
        }

        get hasThreeRightPrevious() {
            return this.visited.has(this.getTileKey(this.row, this.column - 1)) && this.visited.has(this.getTileKey(this.row, this.column - 2)) && this.visited.has(this.getTileKey(this.row, this.column - 3));
        }

        get hasThreeDownPrevious() {
            return this.visited.has(this.getTileKey(this.row - 1, this.column)) && this.visited.has(this.getTileKey(this.row - 2, this.column)) && this.visited.has(this.getTileKey(this.row - 3, this.column));
        }

        get hasThreeUpPrevious() {
            return this.visited.has(this.getTileKey(this.row + 1, this.column)) && this.visited.has(this.getTileKey(this.row + 2, this.column)) && this.visited.has(this.getTileKey(this.row + 3, this.column));
        }

        get hasThreeLeftPrevious() {
            return this.visited.has(this.getTileKey(this.row, this.column + 1)) && this.visited.has(this.getTileKey(this.row, this.column + 2)) && this.visited.has(this.getTileKey(this.row, this.column + 3));
        }
    }

    new Emitter(board, 0, 0, new Map(), 0, [], 0, 0);

    console.log(`Lowest:`, currentLowest);
    console.log(`Iterations:`, iterations);
    console.log(`Active emitters:`, activeEmitters);
    console.log(`Time:`, performance.now() - start);
})();
