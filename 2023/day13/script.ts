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

        const line = groupArr[lineIndex];

        console.log(`line`, line.join(''));
        console.log(`line char`, lineIndex, charIndex);

        const prev = line[charIndex - 1 - increment];
        const curr = line[charIndex + increment];

        console.log(`prev and curr`, prev, curr);

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

        return false;
    }

    groups.slice(0, 1).forEach((group) => {
        const groupArr = group.map((line) => line.split(''))
        console.log(`groupArr`, groupArr);

        const mirrorable = checkMirrorable(groupArr, 0, 0, 0)
        console.log(`mirrorable`, mirrorable);

        // const rotated = rotateN90(groupArr);
        // console.log(`rotated`, rotated);
    });


    console.log(`time`, performance.now() - start);
})();
