(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const DAMAGED = '#';
    const UNKNOWN = '?';

    function getTargetConfig(line: string) {
        const [ _, configData ] = line.split(' ');
        return configData.split(',').map((x) => parseInt(x));
    }

    function permutations(iList: string[], maxLength: number) {
        const cur = Array(maxLength);
        const results = new Set<string>();

        function rec(list: string[], depth = 0) {
            if (depth == maxLength) {
                return results.add(cur.join(''));
            }

            for (let i = 0; i < list.length; ++i) {
                cur[depth] = list.splice(i, 1)[0];
                rec(list, depth + 1);
                list.splice(i, 0, cur[depth]);
            }
        }

        rec(iList);

        return results;
    }

    function getAllPossibleLines(line: string) {
        const lines = new Set<string>();
        const unknowns = line.split('?').length;
        const damaged = Array.from({ length: unknowns }, () => DAMAGED);
        const operational = Array.from({ length: unknowns }, () => OPERATIONAL);
        const perms = permutations([ ...operational, ...damaged ], unknowns);
        console.log(`perms.length`, perms.size);

        perms.forEach((combination) => {
            let newLine = line;

            combination.split('').forEach((value) => {
                newLine = newLine.replace('?', value);
            });

            lines.add(newLine);
        });

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
    const line = '.??..??...?##. 1,1,3';
    const config = getTargetConfig(line);
    console.log(`config`, config);
    const possibleLines = getAllPossibleLines(line);

    possibleLines.forEach((possibleLine) => {
        if (lineMatchesConfig(possibleLine, config)) {
            arrangements++;
            console.log(`possibleLine`, possibleLine);
        }
    });

    console.log(`arrangements`, arrangements);

    console.log(`time`, performance.now() - start);
})();
