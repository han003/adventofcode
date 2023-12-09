(function () {
    const answer = 14429;
    const lines = require('fs').readFileSync('./day8/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.clear();

    const pattern = lines[0].replaceAll('R', '1').replaceAll('L', '0').split('').map((c) => parseInt(c));
    const patternLength = pattern.length;

    const map = lines.slice(1).reduce((acc, line) => {
        acc[line.substring(0, 3)] = [line.substring(7, 10), line.substring(12, 15)];
        return acc;
    }, {} as Record<string, [string, string]>);

    let current = 'AAA';
    let target = 'ZZZ';
    let found = false;
    let step = 0;

    while (!found && step < 1e6) {
        const next = map[current][pattern[step % patternLength]];
        if (next === target) {
            found = true;
            console.log(`found`, step + 1, step + 1 === answer);
        } else {
            current = next;
            step++;
        }
    }

    console.log(`time`, performance.now() - start);
})();
