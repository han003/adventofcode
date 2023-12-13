(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = (input.split(/\r?\n/) as string[]);
    const start = performance.now();

    const groups = [] as string[][];

    let currentGroup = [] as string[];
    lines.forEach((l, i, a) => {
        if (l === '') {
            return;
        }

        currentGroup.push(l);

        if (a[i + 1] === '') {
            groups.push(currentGroup.slice(0));
            currentGroup = [];
        }
    })

    function rotateN90(a: string[][]) {
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

    function checkMirrorable(type: 'row' | 'col', groupArr: string[][], lineIndex: number, charIndex: number, increment: number, originalAnswer?: ['row' | 'col', number]) {
        const isLastLine = lineIndex === groupArr.length - 1;

        if (charIndex === 0) {
            return checkMirrorable(type, groupArr, lineIndex, charIndex + 1, 0, originalAnswer);
        }

        if (charIndex === groupArr[0].length) {
            return null;
        }

        const line = groupArr[lineIndex];

        const prev = line[charIndex - 1 - increment];
        const curr = line[charIndex + increment];

        if (prev === curr && (prev !== undefined || curr !== undefined)) {
            if (isLastLine) {
                return checkMirrorable(type, groupArr, 0, charIndex, increment + 1, originalAnswer);
            } else {
                return checkMirrorable(type, groupArr, lineIndex + 1, charIndex, increment, originalAnswer);
            }
        } else {
            // One side is outside
            if (prev === undefined || curr === undefined) {
                if (isLastLine) {
                    return originalAnswer?.[0] === type && originalAnswer[1] === charIndex ? null : charIndex;
                } else {
                    return checkMirrorable(type, groupArr, lineIndex + 1, charIndex, increment, originalAnswer);
                }
            } else {
                return checkMirrorable(type, groupArr, 0, charIndex + 1, 0, originalAnswer);
            }
        }
    }

    function findAnswerForGroup(groupArr: string[][], originalAnswer?: ['row' | 'col', number]): ['row' | 'col', number] | null {
        const columnAnswer = checkMirrorable('col', groupArr, 0, 0, 0, originalAnswer);
        let rowAnswer: number | null = null;

        if (columnAnswer) {
            return ['col', columnAnswer];
        } else {
            rowAnswer = checkMirrorable('row', rotateN90(groupArr), 0, 0, 0, originalAnswer);

            if (rowAnswer) {
                return ['row', rowAnswer];
            }
        }

        return null;
    }

    const mirrors = {
        rows: [] as number[],
        cols: [] as number[],
    }

    groups.forEach((group) => {
        let hasAnswer = false;
        const groupArr = group.map((line) => line.split(''))
        let previousReplacement: { lineIndex: number, charIndex: number, char: string } | undefined;
        const originalAnswer = findAnswerForGroup(groupArr);

        if (!originalAnswer) {
            console.log(`Something very wrong`,);
            return;
        }

        groupArr.forEach((line, lineIndex) => {
            if (hasAnswer) return;

            line.forEach((char, charIndex) => {
                if (hasAnswer) return;

                if (previousReplacement) {
                    groupArr[previousReplacement.lineIndex][previousReplacement.charIndex] = previousReplacement.char;
                }

                groupArr[lineIndex][charIndex] = char === '#' ? '.' : '#';
                previousReplacement = {char, lineIndex, charIndex};

                const answer = findAnswerForGroup(groupArr, originalAnswer);

                if (answer && !(answer[0] === originalAnswer[0] && answer[1] === originalAnswer[1])) {
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
            });
        });

        if (!hasAnswer) {
            switch (originalAnswer[0]) {
                case 'col':
                    mirrors.cols.push(originalAnswer[1]);
                    break;
                case 'row':
                    mirrors.rows.push(originalAnswer[1]);
                    break;
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
