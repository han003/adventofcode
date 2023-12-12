(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const DAMAGED = '#';
    const UNKNOWN = '?';

    function getTargetConfig(line: string) {
        const [ _, configData ] = line.split(' ');
        return configData.split(',').map((x) => parseInt(x));
    }

    function getAllPossibleLines(line: string) {
        const lines = new Set<string>();
        const unknowns = line.replaceAll(/[^\?]/g, '').length;
        const number = parseInt('1'.repeat(unknowns), 2);

        for (let i = 0; i <= number; i++) {
            let newLine = line;
            const binaryNumber = i.toString(2);
            const replacementArray = (''.padStart(unknowns - binaryNumber.length, '0') + binaryNumber).replaceAll('0', OPERATIONAL).replaceAll('1', DAMAGED).split('');

            replacementArray.forEach((char) => {
                newLine = newLine.replace('?', char);
            });

            lines.add(newLine);
        }

        return Array.from(lines);
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

    lines.forEach((line) => {
        const config = getTargetConfig(line);
        const possibleLines = getAllPossibleLines(line);
        let lineArrangements = 0;

        possibleLines.forEach((possibleLine) => {
            if (lineMatchesConfig(possibleLine, config)) {
                lineArrangements++;
            }
        });

        console.log(`lineArrangements`, lineArrangements);
        arrangements += lineArrangements;
    });

    console.log(`arrangements`, arrangements);

    console.log(`time`, performance.now() - start);
})();
