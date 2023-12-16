(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    let encounteredObstacles = new Map<string, Set<string>>();

    const energizedTiles = new Set<string>();
    let mostEnergizedTileCount = 0;

    const horizontalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('-', '.').split(''))
        return acc;
    }, [] as string[][]);

    const verticalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('|', '.').split(''))
        return acc;
    }, [] as string[][]);

    function resetEncounteredObstacles() {
        encounteredObstacles = new Map<string, Set<string>>(
            [
                ['1,0', new Set()],
                ['0,1', new Set()],
                ['-1,0', new Set()],
                ['0,-1', new Set()],
            ]
        )
    }

    class Beam {
        private board: string[][];
        private rowIncrement = 0;
        private columnIncrement = 0;

        constructor(direction: string, protected row: number = 0, protected column: number = 0, childBeam = false) {
            switch (direction) {
                case 'down':
                    this.rowIncrement = 1;
                    break;
                case 'up':
                    this.rowIncrement = -1;
                    break;
                case 'right':
                    this.columnIncrement = 1;
                    break;
                case 'left':
                    this.columnIncrement = -1;
                    break;
            }

            // Choose correct board
            this.board = this.rowIncrement !== 0 ? verticalBoard : horizontalBoard;

            // Energize where we're at
            this.energize();

            // Move away from the starting point and find the next obstacle
            if (childBeam) {
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

            if (obstacle) {
                const directionKey = `${this.columnIncrement},${this.rowIncrement}`;
                const obstacleKey = `${this.column},${this.row}`;
                const directionObstacles = encounteredObstacles.get(directionKey)!;

                if (directionObstacles.has(obstacleKey)) {
                    return;
                } else {
                    directionObstacles.add(obstacleKey)
                }

                if (this.rowIncrement) { // Row is incrementing, so moving up or down
                    if (this.rowIncrement === 1) { // Moving down
                        switch (obstacle) {
                            case '-':
                                new Beam('left', this.row, this.column, true);
                                new Beam('right', this.row, this.column, true);
                                break;
                            case '/':
                                new Beam('left', this.row, this.column, true);
                                break;
                            case '\\':
                                new Beam('right', this.row, this.column, true);
                                break;
                        }
                    } else { // Moving up
                        switch (obstacle) {
                            case '-':
                                new Beam('left', this.row, this.column, true);
                                new Beam('right', this.row, this.column, true);
                                break;
                            case '/':
                                new Beam('right', this.row, this.column, true);
                                break;
                            case '\\':
                                new Beam('left', this.row, this.column, true);
                                break;
                        }
                    }
                } else { // Column is incrementing, so moving left or right
                    if (this.columnIncrement === 1) { // Moving right
                        switch (obstacle) {
                            case '|':
                                new Beam('up', this.row, this.column, true);
                                new Beam('down', this.row, this.column, true);
                                break;
                            case '/':
                                new Beam('up', this.row, this.column, true);
                                break;
                            case '\\':
                                new Beam('down', this.row, this.column, true);
                                break;
                        }
                    } else { // Moving left
                        switch (obstacle) {
                            case '|':
                                new Beam('up', this.row, this.column, true);
                                new Beam('down', this.row, this.column, true);
                                break;
                            case '/':
                                new Beam('down', this.row, this.column, true);
                                break;
                            case '\\':
                                new Beam('up', this.row, this.column, true);
                                break;
                        }
                    }
                }
            }
        }
    }

    const topRow = horizontalBoard[0];
    topRow.forEach((_, index) => {
        resetEncounteredObstacles();
        energizedTiles.clear();

        new Beam('down', 0, index);

        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });

    const bottomRow = horizontalBoard[horizontalBoard.length - 1];
    bottomRow.forEach((_, index) => {
        resetEncounteredObstacles();
        energizedTiles.clear();

        new Beam('up', horizontalBoard.length - 1, index);

        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });

    const leftColumn = verticalBoard.map((row) => row[0]);
    leftColumn.forEach((_, index) => {
        resetEncounteredObstacles();
        energizedTiles.clear();

        new Beam('right', index, 0);

        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });

    const rightColumn = verticalBoard.map((row) => row[row.length - 1]);
    rightColumn.forEach((_, index) => {
        resetEncounteredObstacles();
        energizedTiles.clear();

        new Beam('left', index, verticalBoard[0].length - 1);

        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });

    console.log(`energizedTiles`, mostEnergizedTileCount);

    console.log(`time`, performance.now() - start);
})();
