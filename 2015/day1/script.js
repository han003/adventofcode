"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const beams = new Set();
    const encounteredObstacles = new Map();
    const energizedTiles = new Set();
    let mostEnergizedTileCount = 0;
    let beamId = 0;
    const horizontalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('-', '.').split(''));
        return acc;
    }, []);
    const verticalBoard = lines.reduce((acc, line) => {
        acc.push(line.replaceAll('|', '.').split(''));
        return acc;
    }, []);
    class Beam {
        constructor(direction, row = 0, column = 0) {
            this.row = row;
            this.column = column;
            this.id = beamId++;
            this.rowIncrement = 0;
            this.columnIncrement = 0;
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
                console.log(`going down`);
            }
            if (this.rowIncrement === -1) {
                console.log(`going up`);
            }
            if (this.columnIncrement === 1) {
                console.log(`going right`);
            }
            if (this.columnIncrement === -1) {
                console.log(`going left`);
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
        nextObstacle() {
            while (this.board[this.row]?.[this.column] === '.') {
                this.move();
            }
            const obstacle = this.board[this.row]?.[this.column];
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
                }
                else {
                    encounteredObstacles.set(directionKey, new Set([obstacleKey]));
                }
                if (this.rowIncrement) { // Row is incrementing, so moving up or down
                    if (this.rowIncrement === 1) { // Moving down
                        switch (obstacle) {
                            case '-':
                                new Beam('left', this.row, this.column);
                                new Beam('right', this.row, this.column);
                                break;
                            case '/':
                                new Beam('left', this.row, this.column);
                                break;
                            case '\\':
                                new Beam('right', this.row, this.column);
                                break;
                        }
                    }
                    else { // Moving up
                        switch (obstacle) {
                            case '-':
                                new Beam('left', this.row, this.column);
                                new Beam('right', this.row, this.column);
                                break;
                            case '/':
                                new Beam('right', this.row, this.column);
                                break;
                            case '\\':
                                new Beam('left', this.row, this.column);
                                break;
                        }
                    }
                }
                else { // Column is incrementing, so moving left or right
                    if (this.columnIncrement === 1) { // Moving right
                        switch (obstacle) {
                            case '|':
                                new Beam('up', this.row, this.column);
                                new Beam('down', this.row, this.column);
                                break;
                            case '/':
                                new Beam('up', this.row, this.column);
                                break;
                            case '\\':
                                new Beam('down', this.row, this.column);
                                break;
                        }
                    }
                    else { // Moving left
                        switch (obstacle) {
                            case '|':
                                new Beam('up', this.row, this.column);
                                new Beam('down', this.row, this.column);
                                break;
                            case '/':
                                new Beam('down', this.row, this.column);
                                break;
                            case '\\':
                                new Beam('up', this.row, this.column);
                                break;
                        }
                    }
                }
            }
            this.handleEndOfLife();
        }
        handleEndOfLife() {
            beams.delete(this.id);
        }
    }
    const topRow = horizontalBoard[0];
    topRow.forEach((_, index) => {
        beams.clear();
        encounteredObstacles.clear();
        energizedTiles.clear();
        beamId = 0;
        new Beam('down', 0, index);
        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });
    const bottomRow = horizontalBoard[horizontalBoard.length - 1];
    bottomRow.forEach((_, index) => {
        beams.clear();
        encounteredObstacles.clear();
        energizedTiles.clear();
        beamId = 0;
        new Beam('up', horizontalBoard.length - 1, index);
        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });
    const leftColumn = verticalBoard.map((row) => row[0]);
    leftColumn.forEach((_, index) => {
        beams.clear();
        encounteredObstacles.clear();
        energizedTiles.clear();
        beamId = 0;
        new Beam('right', index, 0);
        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });
    const rightColumn = verticalBoard.map((row) => row[row.length - 1]);
    rightColumn.forEach((_, index) => {
        beams.clear();
        encounteredObstacles.clear();
        energizedTiles.clear();
        beamId = 0;
        new Beam('left', index, verticalBoard[0].length - 1);
        if (energizedTiles.size > mostEnergizedTileCount) {
            mostEnergizedTileCount = energizedTiles.size;
        }
    });
    console.log(`energizedTiles`, mostEnergizedTileCount);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map