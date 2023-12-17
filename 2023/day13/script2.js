"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/);
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
    function checkMirrorable(type, groupArr, lineIndex, charIndex, increment, originalAnswer) {
        const isLastLine = lineIndex === groupArr.length - 1;
        if (charIndex === 0) {
            return checkMirrorable(type, groupArr, lineIndex, charIndex + 1, 0, originalAnswer);
        }
        if (charIndex === groupArr[0].length && isLastLine) {
            return null;
        }
        const line = groupArr[lineIndex];
        const prev = line[charIndex - 1 - increment];
        const curr = line[charIndex + increment];
        if (prev === curr && (prev !== undefined || curr !== undefined)) {
            if (isLastLine) {
                return checkMirrorable(type, groupArr, 0, charIndex, increment + 1, originalAnswer);
            }
            else {
                return checkMirrorable(type, groupArr, lineIndex + 1, charIndex, increment, originalAnswer);
            }
        }
        else {
            // One side is outside
            if (prev === undefined || curr === undefined) {
                if (isLastLine) {
                    if (originalAnswer?.[0] === type && originalAnswer[1] === charIndex) {
                        return checkMirrorable(type, groupArr, 0, charIndex + 1, 0, originalAnswer);
                    }
                    return charIndex;
                }
                else {
                    return checkMirrorable(type, groupArr, lineIndex + 1, charIndex, increment, originalAnswer);
                }
            }
            else {
                return checkMirrorable(type, groupArr, 0, charIndex + 1, 0, originalAnswer);
            }
        }
    }
    function findAnswerForGroup(groupArr, originalAnswer) {
        const columnAnswer = checkMirrorable('col', groupArr, 0, 0, 0, originalAnswer);
        let rowAnswer = null;
        if (columnAnswer) {
            return ['col', columnAnswer];
        }
        else {
            rowAnswer = checkMirrorable('row', rotateN90(groupArr), 0, 0, 0, originalAnswer);
            if (rowAnswer) {
                return ['row', rowAnswer];
            }
        }
        return null;
    }
    function fixSmudge(groupArr, previousWhere, where) {
        if (where) {
            if (previousWhere) {
                groupArr[previousWhere.lineIndex][previousWhere.colIndex] = groupArr[previousWhere.lineIndex][previousWhere.colIndex] === '#' ? '.' : '#';
            }
            groupArr[where.lineIndex][where.colIndex] = groupArr[where.lineIndex][where.colIndex] === '#' ? '.' : '#';
            return groupArr;
        }
        return groupArr;
    }
    const mirrors = {
        rows: [],
        cols: [],
    };
    groups.forEach((group) => {
        let hasAnswer = false;
        let previousSmudgeLocation = null;
        const groupArr = group.map((line) => line.split(''));
        const originalAnswer = findAnswerForGroup(fixSmudge(groupArr));
        if (!originalAnswer) {
            console.log(`Something very wrong`);
            return;
        }
        for (let lineIndex = 0; lineIndex < group.length; lineIndex++) {
            if (hasAnswer)
                break;
            for (let colIndex = 0; colIndex < group[0].length; colIndex++) {
                if (hasAnswer)
                    break;
                const answer = findAnswerForGroup(fixSmudge(groupArr, previousSmudgeLocation, { lineIndex, colIndex }), originalAnswer);
                previousSmudgeLocation = { lineIndex, colIndex };
                if (answer) {
                    hasAnswer = true;
                    switch (answer[0]) {
                        case 'col':
                            mirrors.cols.push(answer[1]);
                            break;
                        case 'row':
                            mirrors.rows.push(answer[1]);
                            break;
                    }
                }
            }
        }
    });
    const colSum = mirrors.cols.reduce((acc, col) => acc + col, 0);
    const rowSum = mirrors.rows.reduce((acc, row) => acc + (row * 100), 0);
    console.log(`sum`, colSum + rowSum);
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script2.js.map