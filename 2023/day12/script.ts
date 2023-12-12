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
        const unknowns = config.springData.split('').filter((char) => char === '?').length;
        const number = parseInt('1'.repeat(unknowns), 2) + 1;
        console.log(`number`, number);

        for (let i = 0; i < number; i++) {
            let newLine = config.springData;
            const binaryNumber = i.toString(2);
            const replacements = (''.padStart(unknowns - binaryNumber.length, '0') + binaryNumber).replaceAll('0', OPERATIONAL).replaceAll('1', DAMAGED);

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
        const matches = Array.from(line.matchAll(/\.?(#+)\.?/g));
        if (matches.length !== config.length) {
            return false;
        }

        for (let i = 0; i < matches.length; i++) {
            if (matches[i][1].length !== config[i]) {
                return false;
            }
        }

        return true;
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
