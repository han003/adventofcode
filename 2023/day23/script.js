"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map