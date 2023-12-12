(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const DAMAGED = '#';

    interface SpringConfig {
        springData: string;
        config: number[];
    }

    function getConfig(line: string, unfold: boolean): SpringConfig {
        const [ springData, configData ] = line.split(' ');

        return {
            springData: Array.from({ length: unfold ? 5 : 1 }, () => 0).reduce((acc, _, i) => acc.concat(springData), [] as string[]).join(unfold ? '?' : ''),
            config: Array.from({ length: unfold ? 5 : 1 }, () => configData.split(',').map((x) => parseInt(x))).flat(),
        };
    }

    function getAllPossibleLines(config: SpringConfig) {
        let possibilities = 0;
        const unknowns = config.springData.split('').reduce((acc, char, index) => {
            if (char === '?') {
                acc.push(index);
            }

            return acc;
        }, [] as number[]);

        console.log(`unknowns`, unknowns);
        const number = parseInt('1'.repeat(unknowns.length), 2) + 1;
        console.log(`number`, number);

        for (let i = 0; i < number; i++) {
            let newLine = config.springData;
            const binaryNumber = i.toString(2);
            const replacements = (''.padStart(unknowns.length - binaryNumber.length, '0') + binaryNumber).replaceAll('0', OPERATIONAL).replaceAll('1', DAMAGED);

            for (let i = 0; i < replacements.length; i++) {
                newLine = newLine.replace('?', replacements[i]);
            }

            if (lineMatchesConfig(newLine, config.config)) {
                possibilities++;
            }
        }

        return possibilities;
    }

    function lineMatchesConfig(line: string, config: number[]) {
        const split = line.split('.').filter((x) => x.length);
        return split.every((x, i) => x.length === config[i]);
    }

    let arrangements = 0;

    [ '???.### 1,1,3' ].forEach((line) => {
        const config = getConfig(line, true);
        console.log(`config`, config);

        arrangements += getAllPossibleLines(config);
    });

    console.log(`arrangements`, arrangements);
    console.log(`time`, performance.now() - start);
})();
