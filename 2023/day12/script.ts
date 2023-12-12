(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const OPERATIONAL = '.';
    const UNKNOWN = '?';
    const DAMAGED = '#';

    type Block = { size: number, intervals: { from: number, to: number }[] };

    interface SpringConfig {
        line: string;
        blocks: Block[];
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
        // console.log(`block`, block);

        // Find where block can exist on the
        config.line.split('').forEach((_, i, arr) => {
            const previous = (i > 0 ? [arr[i - 1]] : []).map((x) => x === UNKNOWN ? OPERATIONAL : x);
            const current = arr.slice(i, i + block.size).map((x) => x === UNKNOWN ? DAMAGED : x);
            const next = arr.slice(i + block.size, i + block.size + 1).map((x) => x === UNKNOWN ? OPERATIONAL : x);
            // console.log(previous, current, next);

            const fits = current.length === block.size && current.every((x) => x === DAMAGED) && next[0] !== DAMAGED && previous[0] !== DAMAGED;
            if (fits) {
                // console.log(`fits`, i, i + block.size);
                block.intervals.push({from: i, to: i + block.size});
            }
        });
    });

    console.log(`config`, config);

    const checks = config.blocks.reduce((acc, block) => acc * block.intervals.length, 1);
    console.log(`checks`, checks);
    const linesToCheck: { from: number, to: number }[][] = [];

    for (let i = 0; i < checks; i++) {
        const line: { from: number, to: number }[] = [];

        config.blocks.forEach((block, blockIndex) => {
            let index = i % block.intervals.length;

            if (blockIndex > 0) {
                index = Math.floor((i / block.intervals.length)) % block.intervals.length;
            }

            const interval = block.intervals[index];
            if (line.some((l) => l.from === interval.from && l.to === interval.to)) {
                return;
            }

            line.push(interval);
        });

        if (line.length === config.blocks.length) {
            linesToCheck.push(line);
        }
    }

    console.log(`linesToCheck`, linesToCheck);

    console.log(`arrangements`, arrangements);
    console.log(`time`, performance.now() - start);
})();
