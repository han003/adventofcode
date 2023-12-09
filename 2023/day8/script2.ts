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

    const deno: number[] = [];
    const currents = Object.keys(map).filter((k) => k[2] === 'A');

    currents.forEach(c => {
        let found = false;
        let step = 0;
        let max = 1e10;

        while (!found && step < max) {
            const next = map[c][pattern[step % patternLength]];

            if (next[2] === 'Z') {
                found = true;
                deno.push(step + 1);
                break;
            }

            c = next;
            step++;
        }
    })

    const lcm = (...arr: any) => {
        const gcd = (x: any, y: any): any => (!y ? x : gcd(y, x % y));
        const _lcm = (x: any, y: any) => (x * y) / gcd(x, y);
        return [...arr].reduce((a, b) => _lcm(a, b));
    };

    console.log(`steps`, lcm(...deno));

    console.log(`time`, performance.now() - start);
})();
