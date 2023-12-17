"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    function hashAlogorithm(string) {
        let currentValue = 0;
        for (let i = 0; i < string.length; i++) {
            const charCode = string.charCodeAt(i);
            currentValue += charCode;
            currentValue *= 17;
            currentValue %= 256;
        }
        console.log(string, currentValue);
        return currentValue;
    }
    const hashList = input.replaceAll('\r\n', '').split(',');
    console.log(`hashList`, hashList);
    let sum = 0;
    hashList.forEach((hash) => {
        sum += hashAlogorithm(hash);
    });
    console.log(`sum`, sum);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map