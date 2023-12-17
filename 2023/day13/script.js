"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const lines = input.split(/\r?\n/);
    const start = performance.now();
    const groups = [];
    let currentGroup = [];
    lines.forEach((l, i, a) => {
        if (l === '') {
            return;
        }
        currentGroup.push(l);
        if (a[i + 1] === '') {
            groups.push(currentGroup.slice(0));
            currentGroup = [];
        }
    });
    function rotateN90(a) {
        var temp = new Array(a[0].length); // number of columns
        var i = 0;
        for (i = 0; i < temp.length; i++) {
            temp[i] = [];
        }
        for (i = 0; i < a.length; i++) {
            for (let j = 0; j < a[0].length; j++) {
                temp[j][i] = a[i][a[i].length - 1 - j];
            }
        }
        return temp;
    }
    function checkMirrorable(groupArr, lineIndex, charIndex, increment) {
        const isLastLine = lineIndex === groupArr.length - 1;
        if (charIndex === 0) {
            return checkMirrorable(groupArr, lineIndex, charIndex + 1, 0);
        }
        if (charIndex === groupArr[0].length) {
            return null;
        }
        const line = groupArr[lineIndex];
        const prev = line[charIndex - 1 - increment];
        const curr = line[charIndex + increment];
        if (prev === curr && (prev !== undefined || curr !== undefined)) {
            if (isLastLine) {
                return checkMirrorable(groupArr, 0, charIndex, increment + 1);
            }
            else {
                return checkMirrorable(groupArr, lineIndex + 1, charIndex, increment);
            }
        }
        else {
            // One side is outside
            if (prev === undefined || curr === undefined) {
                if (isLastLine) {
                    return charIndex;
                }
                else {
                    return checkMirrorable(groupArr, lineIndex + 1, charIndex, increment);
                }
            }
            else {
                return checkMirrorable(groupArr, 0, charIndex + 1, 0);
            }
        }
        return null;
    }
    const mirrors = {
        rows: [],
        cols: [],
    };
    groups.forEach((group) => {
        // console.log(`---------------------------------`, );
        const groupArr = group.map((line) => line.split(''));
        console.log(`groupArr`, groupArr);
        let rotated = null;
        for (let i = 0; i < 2; i++) {
            const ans = checkMirrorable(rotated || groupArr, 0, 0, 0);
            const type = ['column', 'row', 'reverse-column', 'reverse-row'][i];
            if (ans) {
                switch (type) {
                    case 'column':
                        mirrors.cols.push(ans);
                        break;
                    case 'row':
                        mirrors.rows.push(ans);
                        break;
                }
                break;
            }
            rotated = rotateN90(rotated || groupArr);
            if (i === 1) {
                console.log(`no answer`);
            }
        }
    });
    console.log(`mirrors`, mirrors);
    const colSum = mirrors.cols.reduce((acc, col) => acc + col, 0);
    const rowSum = mirrors.rows.reduce((acc, row) => acc + (row * 100), 0);
    console.log(`colSum`, colSum);
    console.log(`rowSum`, rowSum);
    console.log(`sum`, colSum + rowSum);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map