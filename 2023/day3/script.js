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
    const symbols = new Set();
    for (let i = 0; i < singleLine.length; i++) {
        if (singleLine.charAt(i) === '.' || isNumber(singleLine.charAt(i))) {
            continue;
        }
        symbols.add(singleLine.charAt(i));
    }
    console.log(`symbols`, symbols);
    numberRanges.forEach(([index, lastIndex, number]) => {
        let hasAdjacent = false;
        for (let i = index; i <= lastIndex; i++) {
            hasAdjacent ||= adjacentChecks.some((check) => {
                return Array.from(symbols).includes(singleLine.charAt(i + check));
            });
        }
        if (hasAdjacent) {
            sum += number;
        }
    });
    console.log(`sum`, sum);
})();
//# sourceMappingURL=script.js.map