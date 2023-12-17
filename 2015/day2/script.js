"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const presents = lines.map((line) => {
        const [length, width, height] = line.split('x').map((n) => parseInt(n, 10));
        const side1 = length * width;
        const side2 = width * height;
        const side3 = height * length;
        return {
            length,
            width,
            height,
            side1,
            side2,
            side3,
            surfaceArea: (side1 * 2) + (side2 * 2) + (side3 * 2),
            extra: Math.min(side1, side2, side3),
        };
    });
    console.log(`presents`, presents);
    console.log(`total wrapping paper`, presents.reduce((acc, present) => acc + present.surfaceArea + present.extra, 0));
    console.log(`ribbon`, presents.reduce((acc, present) => {
        const bow = present.length * present.width * present.height;
        console.log(`bow`, bow);
        let wrap = [present.length, present.width, present.height].sort((a, b) => a - b).slice(0, 2).reduce((acc, side) => acc + (side * 2), 0);
        console.log(`wrap`, wrap);
        return acc + bow + wrap;
    }, 0));
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map