"use strict";
(function () {
    (function () {
        const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8');
        const lines = input.split(/\r?\n/).filter((l) => l.length);
        const start = performance.now();
        function getSpringsAndTargetConfig(line) {
            const [springs, config] = line.split(' ');
            return {
                springs,
                config: config.split(',').map((x) => parseInt(x)),
            };
        }
        lines.forEach((line) => {
            console.log(line, getSpringsAndTargetConfig(line));
        });
        console.log(`time`, performance.now() - start);
        // console.log(`sum`, sum);
    })();
})();
//# sourceMappingURL=script2.js.map