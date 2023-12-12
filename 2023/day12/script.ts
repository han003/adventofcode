(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const UNKNOWN = '?';
    const DAMAGED = '#';

    interface SpringConfig {
        line: string;
        blocks: { size: number, intervals: {from: number, to: number}[] }[];
    }

    function getConfig(line: string, unfold: boolean): SpringConfig {
        const [springData, configData] = line.split(' ');

        return {
            line: Array.from({length: unfold ? 5 : 1}, () => 0).reduce((acc, _, i) => acc.concat(springData), [] as string[]).join(unfold ? '?' : ''),
            blocks: Array.from({length: unfold ? 5 : 1}, () => configData.split(',').map((x) => parseInt(x))).flat().map((size) => {
                return {size, intervals: []};
            }),
        };
    }

    let arrangements = 0;
    const string = '.??..??...?## 1,1,3';
    const config = getConfig(string, false);

    console.log(`config`, config);

    config.blocks.forEach(block => {
        const intervals: number[][] = [];

        console.log(`block`, block);
        // Find where block can exist on the
        config.line.split('').forEach((_, i, arr) => {
            const previous = (i > 0 ? [arr[i - 1]] : []).map((x) => x === UNKNOWN ? OPERATIONAL : x);
            const current = arr.slice(i, i + block.size).map((x) => x === UNKNOWN ? DAMAGED : x);
            const next = arr.slice(i + block.size, i + block.size + 1).map((x) => x === UNKNOWN ? OPERATIONAL : x);
            console.log(previous, current, next);

            const fits = current.length === block.size && current.every((x) => x === DAMAGED) && next[0] !== DAMAGED && previous[0] !== DAMAGED;
            if (fits) {
                console.log(`fits`, i, i + block.size);
                block.intervals.push({from: i, to: i + block.size});
            }
        });
    });

    console.log(`config`, config);




    console.log(`arrangements`, arrangements);
    console.log(`time`, performance.now() - start);
})();
