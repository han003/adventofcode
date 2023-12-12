(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const DAMAGED = '#';
    const UNKNOWN = '?';

    function getSpringsAndTargetConfig(line: string) {
        const [ springs, configData ] = line.split(' ');
        const config = configData.split(',').map((x) => parseInt(x));
        const brokenSprings = springs.split(OPERATIONAL).filter((x) => x.length);
        console.log(`brokenSprings`, brokenSprings);

        return {
            springs,
            config,
            matches: brokenSprings.every((brokenSpring, i) => brokenSpring.length === config[i]),
        };
    }

    lines.forEach((line) => {
        console.log(line, getSpringsAndTargetConfig(line));
    });

    console.log(`time`, performance.now() - start);
})();
