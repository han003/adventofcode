"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const lines = input.split(/\r?\n/).filter((l) => l.length).map((l) => l.split(''));
    const start = performance.now();
    const ROUNDROCK = 'O';
    const CUBEROCK = '#';
    const EMPTY = '.';
    function moveRoundRock(row, col) {
        if (row === 0) {
            return;
        }
        if (lines[row - 1][col] === EMPTY) {
            lines[row - 1][col] = ROUNDROCK;
            lines[row][col] = EMPTY;
            moveRoundRock(row - 1, col);
        }
    }
    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            if (lines[row][col] !== ROUNDROCK) {
                continue;
            }
            moveRoundRock(row, col);
        }
    }
    // lines.forEach((line) => console.log(line.join('')));
    const sum = lines.reduce((acc, line, index, arr) => {
        const lineValue = arr.length - index;
        const lineItems = line.filter((x) => x === ROUNDROCK).length;
        return acc + lineValue * lineItems;
    }, 0);
    console.log(`sum`, sum);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map