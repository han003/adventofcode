"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const board = lines.map(l => l.split('').map(s => parseInt(s)));
    let activeEmitters = 0;
    let currentLowest = Infinity;
    class Emitter {
        constructor(board, row, column, visited, values, path, largestRow, largestColumn) {
            this.row = row;
            this.column = column;
            this.visited = visited;
            this.values = values;
            this.largestRow = largestRow;
            this.largestColumn = largestColumn;
            activeEmitters++;
            console.log(`--------------------------------------`);
            if (row === board.length - 1 && column === board[0].length - 1) {
                console.log(`DONE THIS`, this.getSum());
                if (this.getSum() < currentLowest) {
                    currentLowest = this.getSum();
                }
                activeEmitters--;
                return;
            }
            const tileValue = board[row]?.[column];
            if (tileValue == null) {
                console.log(`No tile`);
                activeEmitters--;
                return;
            }
            if (visited.has(this.getTileKey())) {
                console.log(`already visited`, this.getTileKey());
                activeEmitters--;
                return;
            }
            if (row < largestRow && (largestRow - row) > 1) {
                console.log(`too far up`);
                activeEmitters--;
                return;
            }
            if (column < largestColumn && (largestColumn - column) > 1) {
                console.log(`too far left`);
                activeEmitters--;
                return;
            }
            if (this.getSum() >= currentLowest) {
                console.log(`sum will exceed`);
                return;
            }
            visited.set(this.getTileKey(), tileValue);
            // console.log(`this`, this);
            console.log(`activeEmitters`, activeEmitters);
            if (!this.hasThreeLeftPrevious) {
                new Emitter(board, row, column - 1, new Map(visited), values.concat(tileValue), path.concat(this.getTileKey()), Math.max(this.largestRow, row), Math.max(this.largestColumn, column));
            }
            if (!this.hasThreeRightPrevious) {
                new Emitter(board, row, column + 1, new Map(visited), values.concat(tileValue), path.concat(this.getTileKey()), Math.max(this.largestRow, row), Math.max(this.largestColumn, column));
            }
            if (!this.hasThreeDownPrevious) {
                new Emitter(board, row + 1, column, new Map(visited), values.concat(tileValue), path.concat(this.getTileKey()), Math.max(this.largestRow, row), Math.max(this.largestColumn, column));
            }
            if (!this.hasThreeUpPrevious) {
                new Emitter(board, row - 1, column, new Map(visited), values.concat(tileValue), path.concat(this.getTileKey()), Math.max(this.largestRow, row), Math.max(this.largestColumn, column));
            }
        }
        getSum() {
            return this.values.reduce((acc, v) => acc + v, 0);
        }
        getTileKey(row, column) {
            return `${row ?? this.row},${column ?? this.column}`;
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
    new Emitter(board, 0, 0, new Map(), [], [], 0, 0);
})();
//# sourceMappingURL=script.js.map