"use strict";
(function () {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    const start = performance.now();
    console.log(`time`, performance.now() - start);
    const expansionSize = 1;
    function rotate(matrix, times) {
        let rotated = matrix.slice(0);
        for (let i = 0; i < times; i++) {
            rotated = rotated[0].map((_, i) => rotated.map((row) => row[i]));
        }
        return rotated;
    }
    function expandEmpty(lines) {
        let expanded = [];
        lines.forEach((line) => {
            const empty = line.replaceAll('.', '').length === 0;
            if (empty) {
                expanded = expanded.concat(Array.from({ length: expansionSize === 1 ? 2 : expansionSize }, () => line));
            }
            else {
                expanded.push(line);
            }
        });
        return expanded;
    }
    function to2D(array) {
        return array.reduce((acc, line) => {
            acc.push(line.split(''));
            return acc;
        }, []);
    }
    function findPairs(array) {
        return [].concat(...array.map((v, i) => array.slice(i + 1).map((w) => [v, w])));
    }
    const semiExpandedStarMap = expandEmpty(lines);
    const twoDMap = to2D(semiExpandedStarMap);
    const rotatedOne = rotate(twoDMap, 1);
    const expandedOne = expandEmpty(rotatedOne.map((line) => line.join('')));
    const finalExpandedMap = rotate(to2D(expandedOne), 3).map((line) => line.join(''));
    const galaxies = finalExpandedMap.reduce((acc, line, lineIndex) => {
        line.split('').forEach((char, charIndex) => {
            if (char === '#') {
                const id = String(Object.keys(acc).length);
                acc[id] = {
                    id,
                    x: charIndex,
                    y: lineIndex,
                };
            }
        });
        return acc;
    }, {});
    console.log(`galaxies`, galaxies);
    const galaxyIds = Object.keys(galaxies).map((galaxyId) => galaxyId);
    function findDistance(g1, g2) {
        const yDiff = Math.abs(g1.y - g2.y);
        const xDiff = Math.abs(g1.x - g2.x);
        return xDiff + yDiff;
    }
    const sum = findPairs(galaxyIds).reduce((acc, [g1, g2]) => {
        return acc + findDistance(galaxies[g1], galaxies[g2]);
    }, 0);
    console.log(`sum`, sum);
})();
//# sourceMappingURL=script.js.map