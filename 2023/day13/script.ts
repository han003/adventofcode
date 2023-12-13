(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const lines = (input.split(/\r?\n/) as string[]);
    const start = performance.now();

    const indexes = lines.reduce((acc, line, i) => line === '' ? acc.concat(i) : acc, [] as number[]);
    const groups: string[][] = [];
    let prevIndex = 0;
    let currentIndex = indexes.shift();
    while (currentIndex) {
        groups.push(lines.slice(prevIndex, currentIndex));
        prevIndex = currentIndex! + 1;
        currentIndex = indexes.shift();
    }

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

    function checkMirrorable(groupArr: string[][], lineIndex: number, charIndex: number, increment: number) {
        if (charIndex === 0) {
            return checkMirrorable(groupArr, lineIndex, charIndex + 1, 0);
        }

        if (charIndex === groupArr[lineIndex].length - 1) {
            return null;
        }

        const line = groupArr[lineIndex];

        // console.log(`line`, line.join(''));
        // console.log(`line char`, lineIndex, charIndex);

        const prev = line[charIndex - 1 - increment];
        const curr = line[charIndex + increment];

        // console.log(`prev and curr`, prev, curr);

        // Line finished successfully, check next line
        if (prev === undefined || curr === undefined) {
            if (lineIndex === groupArr.length - 1) {
                return charIndex;
            }

            return checkMirrorable(groupArr, lineIndex + 1, charIndex, 0);
        }

        // If chars are the same, check next char
        if (prev === curr) {
            return checkMirrorable(groupArr, lineIndex, charIndex, increment + 1);
        } else { // Or update char index and check
            return checkMirrorable(groupArr, lineIndex, charIndex + 1, 0);
        }
    }

    const mirrors = {
        rows: [] as number[],
        cols: [] as number[],
    }

    groups.forEach((group) => {
        console.log(`---------------------------------`, );
        const groupArr = group.map((line) => line.split(''))
        const rows = groupArr.length;
        const cols = groupArr[0].length;

        // console.log(`groupArr`, groupArr);

        let rotated = null;
        for (let i = 0; i < 4; i++) {
            const ans = checkMirrorable(rotated || groupArr, 0, 0, 0);
            const type = ['column', 'row', 'reverse-column', 'reverse-row'][i]

            if (ans) {
                switch (type) {
                    case 'column':
                        mirrors.cols.push(ans);
                        break;
                    case 'row':
                        mirrors.rows.push(ans);
                        break;
                    case 'reverse-column':
                        console.log(`ORIGINAL`, );
                        groupArr.forEach((line) => console.log(line.join('')));

                        console.log(`REVERSE COL`, );
                        rotated?.forEach((line) => console.log(line.join('')));

                        console.log(`cols`, cols);
                        console.log(`rows`, rows);
                        console.log(`ans`, ans);
                        console.log(`real`, cols - ans);

                        mirrors.cols.push(cols - ans);
                        break;
                    case 'reverse-row':
                        console.log(`ORIGINAL`, );
                        groupArr.forEach((line) => console.log(line.join('')));

                        console.log(`REVERSE ROW`, );
                        rotated?.forEach((line) => console.log(line.join('')));

                        console.log(`cols`, cols);
                        console.log(`rows`, rows);
                        console.log(`ans`, ans);
                        console.log(`real`, rows - ans  - 1);

                        mirrors.rows.push(rows - ans  - 1);
                        break;
                }

                break;
            }

            rotated = rotateN90(rotated || groupArr);
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
