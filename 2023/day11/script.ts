(function() {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.log(`time`, performance.now() - start);

    function showStarMap(lines: string[]) {
        console.group('Star map');
        lines.forEach((line) => {
            console.log(line);
        });
        console.groupEnd();
    }

    function rotate(matrix: string[][], times: number) {
        let rotated = matrix.slice(0);

        for (let i = 0; i < times; i++) {
            rotated = rotated[0].map((_, i) => rotated.map((row) => row[i]));
        }

        return rotated;
    }

    function expandEmpty(lines: string[]) {
        let expanded: string[] = [];

        lines.forEach((line) => {
            const empty = line.replaceAll('.', '').length === 0;

            if (empty) {
                expanded = expanded.concat([ line, line ]);
            } else {
                expanded.push(line);
            }
        });

        return expanded;
    }

    function to2D(array: string[]) {
        return array.reduce((acc, line) => {
            acc.push(line.split(''));
            return acc;
        }, [] as string[][]);
    }

    const semiExpandedStarMap: string[] = expandEmpty(lines);
    showStarMap(semiExpandedStarMap);

    const twoDMap = to2D(semiExpandedStarMap);
    const rotatedOne = rotate(twoDMap, 1);
    const expandedOne = expandEmpty(rotatedOne.map((line) => line.join('')));
    const twoDMapTwo = to2D(expandedOne);

    showStarMap(rotate(twoDMapTwo, 3).map((line) => line.join('')));
})();
