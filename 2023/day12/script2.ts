(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const UNKNOWN = '?';
    const OPERATIONAL = '.';
    const DAMAGED = '#';

    interface SpringConfig {
        line: string;
        groups: number[];
    }

    type LineState = Record<string, {
        groupIndex: number;
        lineIndex: number;
    }>;

    function getConfig(line: string, unfold: boolean): SpringConfig {
        const [springData, configData] = line.split(' ');

        return {
            line: Array.from({length: unfold ? 5 : 1}, () => 0).reduce((acc, _, i) => acc.concat(springData), [] as string[]).join(unfold ? '?' : ''),
            groups: Array.from({length: unfold ? 5 : 1}, () => configData.split(',').map((x) => parseInt(x))).flat(),
        };
    }

    function recursive(config: SpringConfig, line: string, lineIndex: number, groupIndex: number, lineState: LineState, answers: Set<string>): void {
        console.log(`recursive group ${groupIndex} --------------------------------------`,);
        console.log(`line`, line);
        const groupSize = config.groups[groupIndex];
        console.log(`groupSize`, groupSize);
        const groupLine = line.substring(lineIndex, lineIndex + groupSize);
        console.log(`groupLine`, groupLine);

        const replacedGroupLine = groupLine.replaceAll(UNKNOWN, DAMAGED);
        console.log(`replacedGroupLine`, replacedGroupLine);

        if (replacedGroupLine.split('').some((x) => x !== DAMAGED)) {
            console.log(`not totally damaged [`, replacedGroupLine, `] going to next`);
            return recursive(config, line, lineIndex + 1, groupIndex, lineState, answers);
        }

        const previousChar = line.charAt(lineIndex - 1);
        const nextChar = line.charAt(lineIndex + groupSize);
        if (previousChar === DAMAGED || nextChar === DAMAGED) {
            console.log(`surroundings are damaged`);
            return recursive(config, line, lineIndex + 1, groupIndex, lineState, answers);
        }

        const convertedPreviousChar = previousChar ? '.' : previousChar;
        const convertedNextChar = nextChar ? '.' : nextChar;
        const updatedLine = line.substring(0, lineIndex - 1) + convertedPreviousChar + replacedGroupLine + convertedNextChar + line.substring(lineIndex + groupSize + 1);
        console.log(`updatedLine`, updatedLine);

        lineState[updatedLine] = {
            groupIndex,
            lineIndex,
        };

        console.log(`lineState`, lineState);

        if (groupIndex < config.groups.length - 1 ) {
            console.log(`going to next group`);
            // line index + 2?
            return recursive(config, updatedLine, lineIndex + 1, groupIndex + 1, lineState, answers);
        }

        // DONE HERE?
        answers.add(updatedLine);

        console.log(`last group`);
        console.log(`answers`, answers);
        console.log(`lineState`, lineState);
        return;
    }

    const line = '.??..??...?##. 1,1,3';
    const config = getConfig(line, false);
    console.log(`config`, config);

    recursive(config, config.line, 0, 0, {}, new Set());

    console.log(`time`, performance.now() - start);
})();
