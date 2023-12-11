(function() {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.log(`time`, performance.now() - start);

    const universeWidth = lines[0].length;
    console.log(`universeWidth`, universeWidth);
    const universeHeight = lines.length;
    console.log(`universeHeight`, universeHeight);
    const expansionSize = 1;

    function findPairs<T>(array: T[]) {
        return ([] as T[][]).concat(...array.map(
            (v, i) => array.slice(i + 1).map((w) => [ v, w ])),
        );

    }

    function findDistance(g1: Galaxy, g2: Galaxy) {
        const yDiff = Math.abs((g1.y) - (g2.y));
        const xDiff = Math.abs((g1.x) - (g2.x));

        return xDiff + yDiff;
    }

    type Galaxy = { id: string, x: number, y: number, xExpansions: number, yExpansions: number };
    const galaxies = lines.reduce((acc, line, lineIndex) => {
        line.split('').forEach((char, charIndex) => {
            if (char === '#') {
                const id = String(Object.keys(acc).length);

                acc[id] = {
                    id,
                    x: charIndex,
                    y: lineIndex,
                    xExpansions: 0,
                    yExpansions: 0,
                };
            }
        });

        return acc;
    }, {} as Record<string, Galaxy>);

    type Expansion = { x?: number, y?: number };
    const expansions: Expansion[] = [];
    for (let i = 0; i < universeWidth; i++) {
        const empty = !Object.values(galaxies).find((g) => g.x === i);
        if (empty) {
            expansions.push({ x: i });
        }
    }
    for (let i = 0; i < universeHeight; i++) {
        const empty = !Object.values(galaxies).find((g) => g.y === i);
        if (empty) {
            expansions.push({ y: i });
        }
    }

    expansions.forEach((expansion) => {
        if (expansion.x) {
            Object.values(galaxies).forEach((galaxy) => {
                if (galaxy.x > expansion.x!) {
                    galaxy.xExpansions++;
                }
            });
        }

        if (expansion.y) {
            Object.values(galaxies).forEach((galaxy) => {
                if (galaxy.y > expansion.y!) {
                    galaxy.yExpansions++;
                }
            });
        }
    });

    Object.values(galaxies).forEach((galaxy) => {
        if (expansionSize === 1) {
            galaxy.x = galaxy.x + galaxy.xExpansions;
            galaxy.y = galaxy.y + galaxy.yExpansions;
        } else {
            galaxy.x = (galaxy.x + (galaxy.xExpansions * expansionSize)) - galaxy.xExpansions;
            galaxy.y = (galaxy.y + (galaxy.yExpansions * expansionSize)) - galaxy.yExpansions;
        }
    });

    console.log(`expansions`, expansions);
    console.log(`galaxies`, galaxies);
    console.log(`number of galaxies`, Object.keys(galaxies).length);

    const sum = findPairs(Object.keys(galaxies).map((galaxyId) => galaxyId)).reduce((acc, [ g1, g2 ]) => {
        return acc + findDistance(galaxies[g1], galaxies[g2]);
    }, 0);

    console.log(`sum`, sum);
})();
