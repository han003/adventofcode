"use strict";
(function () {
    const answer = 14429;
    const lines = require('fs').readFileSync('./day8/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    const start = performance.now();
    console.clear();
    const pattern = lines[0].replaceAll('R', '1').replaceAll('L', '0').split('').map((c) => parseInt(c));
    const patternLength = pattern.length;
    const map = lines.slice(1).reduce((acc, line) => {
        acc[line.substring(0, 3)] = [line.substring(7, 10), line.substring(12, 15)];
        return acc;
    }, {});
    let currents = Object.keys(map).filter((k) => k[2] === 'A');
    let found = false;
    let step = 0;
    while (!found && step < 1e8) {
        const index = pattern[step % patternLength];
        currents = currents.map((c) => map[c][index]);
        if (currents.every((c) => c[2] === 'Z')) {
            found = true;
            console.log(`found`, step + 1, step + 1 === answer);
        }
        step++;
    }
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script_brute.js.map