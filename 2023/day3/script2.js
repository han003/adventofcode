"use strict";
(function () {
    console.clear();
    function getLines() {
        return require('fs').readFileSync('./day3/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    }
    function isNumber(char) {
        return !isNaN(parseInt(char));
    }
    let sum = 0;
    const lines = getLines();
    const lineLength = lines[0].length;
    const singleLine = lines.join('');
    let numberRanges = [];
    let groupId = 0;
    for (let i = 0; i < singleLine.length; i++) {
        if (!isNumber(singleLine.charAt(i))) {
            continue;
        }
        groupId++;
        let index = i;
        let lastIndex = i;
        i++;
        while (isNumber(singleLine.charAt(i))) {
            lastIndex = i;
            i++;
        }
        numberRanges.push([index, lastIndex, parseInt(singleLine.slice(index, lastIndex + 1))]);
    }
    console.log(`numbers`, numberRanges);
    const adjacentChecks = [
        -1,
        1,
        -lineLength,
        lineLength,
        -lineLength - 1,
        -lineLength + 1,
        lineLength - 1,
        lineLength + 1, // bottom right
    ];
    for (let i = 0; i < singleLine.length; i++) {
        if (singleLine.charAt(i) !== '*') {
            continue;
        }
        const adjecentNumbers = numberRanges.filter(([index, lastIndex]) => {
            return adjacentChecks.some((check) => {
                const checkIndex = i + check;
                return checkIndex >= index && checkIndex <= lastIndex;
            });
        });
        console.log(`adjecentNumbers`, adjecentNumbers);
        if (adjecentNumbers.length === 2) {
            sum += adjecentNumbers[0][2] * adjecentNumbers[1][2];
        }
    }
    console.log(`sum`, sum);
})();
//# sourceMappingURL=script2.js.map