(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const beams = new Set<number>();
    const encounteredObstacles = new Map<string, Set<string>>();
    const energizedTiles = new Set<string>();
    let beamId = 0;

    const horizontalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('-', '.').split(''))
        return acc;
    }, [] as string[][]);

    const verticalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('|', '.').split(''))
        return acc;
    }, [] as string[][]);

    class Beam {
        private id = beamId++;
        private board: string[][];

        constructor(protected rowIncrement = 0, protected columnIncrement = 0, protected row: number = 0, protected column: number = 0) {
            console.log(`this.id`, this.id);

            // Choose correct board
            this.board = rowIncrement !== 0 ? verticalBoard : horizontalBoard;

            // Energize where we're at
            this.energize();

            // Add beam to the beam tracker
            beams.add(this.id);

            // Move away from the starting point and find the next obstacle
            if (this.id > 0) {
                this.move();
            }

            this.nextObstacle();
        }

        energize() {
            // Only energize if we're on the board
            if (this.column >= 0 && this.column < this.board[0].length && this.row >= 0 && this.row < this.board.length) {
                energizedTiles.add(`${this.column},${this.row}`);
            }
        }

        logDirection() {
            if (this.rowIncrement === 1) {
                console.log(`going down`,);
            }
            if (this.rowIncrement === -1) {
                console.log(`going up`,);
            }
            if (this.columnIncrement === 1) {
                console.log(`going right`,);
            }
            if (this.columnIncrement === -1) {
                console.log(`going left`,);
            }
        }

        logBoard() {
            const board = structuredClone(this.board);
            board[this.row][this.column] = 'X';

            board.forEach((row) => {
                console.log(row.join(''));
            });
        }

        move() {
            this.row += this.rowIncrement;
            this.column += this.columnIncrement;

            // Energize every time we move
            this.energize();
        }

        nextObstacle(): void {
            while (this.board[this.row]?.[this.column] === '.') {
                this.move();
            }

            const obstacle = this.board[this.row]?.[this.column];
            console.log(`obstacle`, obstacle);

            if (obstacle) {
                const directionKey = `${this.columnIncrement},${this.rowIncrement}`;
                const obstacleKey = `${this.column},${this.row}`;

                if (encounteredObstacles.get(directionKey)?.has(obstacleKey)) {
                    this.handleEndOfLife();
                    return;
                }

                const setOfEncounteredObstaclesForDirectionKey = encounteredObstacles.get(directionKey);
                if (setOfEncounteredObstaclesForDirectionKey) {
                    setOfEncounteredObstaclesForDirectionKey.add(obstacleKey);
                } else {
                    encounteredObstacles.set(directionKey, new Set([obstacleKey]));
                }

                if (this.rowIncrement) { // Row is incrementing, so moving up or down
                    if (this.rowIncrement === 1) { // Moving down
                        switch (obstacle) {
                            case '-':
                                new Beam(0, 1, this.row, this.column);
                                new Beam(0, -1, this.row, this.column);
                                break;
                            case '/':
                                new Beam(0, -1, this.row, this.column);
                                break;
                            case '\\':
                                new Beam(0, 1, this.row, this.column);
                                break;
                        }
                    } else { // Moving up
                        switch (obstacle) {
                            case '-':
                                new Beam(0, 1, this.row, this.column);
                                new Beam(0, -1, this.row, this.column);
                                break;
                            case '/':
                                new Beam(0, 1, this.row, this.column);
                                break;
                            case '\\':
                                new Beam(0, -1, this.row, this.column);
                                break;
                        }
                    }
                } else { // Column is incrementing, so moving left or right
                    if (this.columnIncrement === 1) { // Moving right
                        switch (obstacle) {
                            case '|':
                                new Beam(1, 0, this.row, this.column);
                                new Beam(-1, 0, this.row, this.column);
                                break;
                            case '/':
                                new Beam(-1, 0, this.row, this.column);
                                break;
                            case '\\':
                                new Beam(1, 0, this.row, this.column);
                                break;
                        }
                    } else { // Moving left
                        switch (obstacle) {
                            case '|':
                                new Beam(1, 0, this.row, this.column);
                                new Beam(-1, 0, this.row, this.column);
                                break;
                            case '/':
                                new Beam(1, 0, this.row, this.column);
                                break;
                            case '\\':
                                new Beam(-1, 0, this.row, this.column);
                                break;
                        }
                    }
                }
            }

            this.handleEndOfLife();
        }


        handleEndOfLife() {
            console.log(`end of life for beam`, this.id);
            beams.delete(this.id);

            if (beams.size === 0) {
                console.log(`all beams are dead`);
            }
        }
    }

    new Beam(0, 1);

    console.log(`energizedTiles`, energizedTiles.size);

    console.log(`time`, performance.now() - start);
})();
