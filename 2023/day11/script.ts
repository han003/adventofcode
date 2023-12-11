(function() {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.log(`time`, performance.now() - start);

    function permutator<T>(inputArr: T[]) {
        const result: T[][] = [];

        const permute = (arr: T[], m: T[] = []) => {
            if (arr.length === 0) {
                result.push(m);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    const curr = arr.slice();
                    const next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        };

        permute(inputArr);

        return result;
    }

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

    function findPairs<T>(array: T[]) {
        return ([] as T[][]).concat(...array.map(
            (v, i) => array.slice(i + 1).map((w) => [ v, w ])),
        );
    }

    const semiExpandedStarMap: string[] = expandEmpty(lines);
    showStarMap(semiExpandedStarMap);

    const twoDMap = to2D(semiExpandedStarMap);
    const rotatedOne = rotate(twoDMap, 1);
    const expandedOne = expandEmpty(rotatedOne.map((line) => line.join('')));
    const finalExpandedMap = rotate(to2D(expandedOne), 3).map((line) => line.join(''));

    showStarMap(finalExpandedMap);

    type Galaxy = { id: string, x: number, y: number };
    const galaxies = finalExpandedMap.reduce((acc, line, lineIndex) => {
        line.split('').forEach((char, charIndex) => {
            if (char === '#') {
                const id = String(Object.keys(acc).length);

                acc[id] = {
                    id,
                    x: charIndex,
                    y: lineIndex,
                };
            }
        });

        return acc;
    }, {} as Record<string, Galaxy>);

    console.log(`galaxies`, galaxies);
    console.log(`number of galaxies`, Object.keys(galaxies).length);
    const galaxyIds = Object.keys(galaxies).map((galaxyId) => galaxyId);

    console.log('pairs', findPairs(galaxyIds).length);

    function findDistance(g1: Galaxy, g2: Galaxy) {
        const yDiff = Math.abs(g1.y - g2.y);
        const xDiff = Math.abs(g1.x - g2.x);

        return xDiff + yDiff;
    }

    const sum = findPairs(galaxyIds).reduce((acc, [ g1, g2 ]) => {
        return acc + findDistance(galaxies[g1], galaxies[g2]);
    }, 0);

    console.log(`sum`, sum);
})();
