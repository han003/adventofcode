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

    function findOkVerticalIndexes(group: string[]) {
        const leftSide = group.reduce((acc, line) => acc + line[0], '');
        const rightSide = group.reduce((acc, line) => acc + line[line.length - 1], '');

        // Left to right
        const possibleTopIndexes = findOkHorizontalIndexes(leftSide, '.');
        const possibleBottomIndexes = findOkHorizontalIndexes(rightSide, '#');
        let possibleHorizontalPaths = possibleTopIndexes.filter((topIndex) => possibleBottomIndexes.includes(topIndex));

        // Right to left
        const possibleTopIndexes2 = findOkHorizontalIndexes(leftSide, '#');
        const possibleBottomIndexes2 = findOkHorizontalIndexes(rightSide, '.');
        possibleHorizontalPaths = possibleTopIndexes2.filter((topIndex) => possibleBottomIndexes2.includes(topIndex)).concat(possibleHorizontalPaths);

        return possibleHorizontalPaths;
    }

    function findOkHorizontalIndexes(line: string, target: '.' | '#') {
        return line.split('').reduce((acc, char, index, arr) => {
            if (index === arr.length - 1) return acc;

            const nextChar = arr[index + 1];
            if (char === target && nextChar === target) {
                acc.push(index);
            }

            return acc;
        }, [] as number[]);
    }

    function getPossiblePaths(group: string[]) {
        // Top to bottom
        const possibleTopIndexes = findOkHorizontalIndexes(group[0], '.');
        const possibleBottomIndexes = findOkHorizontalIndexes(group[group.length - 1], '#');
        let possibleVerticalPaths = possibleTopIndexes.filter((topIndex) => possibleBottomIndexes.includes(topIndex));

        // Bottom to top
        const possibleTopIndexes2 = findOkHorizontalIndexes(group[0], '#');
        const possibleBottomIndexes2 = findOkHorizontalIndexes(group[group.length - 1], '.');
        possibleVerticalPaths = possibleTopIndexes2.filter((topIndex) => possibleBottomIndexes2.includes(topIndex)).concat(possibleVerticalPaths);

        const res = {
            // Check down
            vertical: new Set(possibleVerticalPaths),
            // Check right
            horizontal: new Set(findOkVerticalIndexes(group))
        }

        return res;
    }

    function getDistanceToMirrors(line: string, path: number) {
        console.log(`-------------------------`,);

        console.log(`line`, line);

        if (line[path] === '#' && line[path + 1] === '#') {
            return [0, 0];
        }

        const left = line.slice(0, path).split('').reverse().join('');
        const leftIndex = left.indexOf('#') + 1;


        return [leftIndex, line.slice(path).indexOf('#') - 1];
    }

    function checkVerticalPath(group: string[], path: number) {
        console.log(group);
        console.log(`path`, path);

        return group.every((line) => {
            const distance = getDistanceToMirrors(line, path);
            return distance[0] === distance[1];
        });
    }

    groups.slice(0, 1).forEach((group) => {
        console.log(`group`, group);

        const paths = getPossiblePaths(group);
        console.log(`paths`, paths);

        paths.vertical.forEach((path) => {
            const isValid = checkVerticalPath(group, path)
            console.log(`VERTICAL isValid`, isValid, path);
        });
    });

    console.log(`time`, performance.now() - start);
})();
