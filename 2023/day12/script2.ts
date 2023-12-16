(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const lines = input.split(/\r?\n/).filter((l) => l.length) as string[];
    const start = performance.now();
    const UNKNOWN = '?';
    const OPERATIONAL = '.';
    const DAMAGED = '#';

    type SpringConfigGroup = { size: number, regex: RegExp };

    interface SpringConfig {
        line: string;
        groups: SpringConfigGroup[];
    }

    function getConfig(line: string, unfold: boolean): SpringConfig {
        const [springData, configData] = line.split(' ');

        return {
            line: Array.from({length: unfold ? 5 : 1}, () => 0).reduce((acc, _, i) => acc.concat(springData), [] as string[]).join(unfold ? '?' : ''),
            groups: Array.from({length: unfold ? 5 : 1}, () => configData.split(',').map((x) => parseInt(x))).flat().map((size, i, arr) => {
                return {
                    size,
                    regex: new RegExp(
                        '.*' + arr.slice(0, i + 1).map((x) => `#{${x}}`).join('\\.+') + (arr.length === i + 1 ? '.*' : `(\\.{1}|)`)
                    )
                }
            })
        };
    }

    /**
     * Checks if the line can fit the group
     * @param line - Part of the line
     * @param group - The group
     */
    function canFitGroups(line: string, group: SpringConfigGroup) {
        console.log(`Can fit`, group, line);
        return group.regex.test(line)
    }


    function getValidArrangements(config: SpringConfig, line: string, lineIndex: number, groupIndex: number) {
        console.log(`------------------------------------------------------------------`);
        console.log(`Line ${lineIndex} / Group ${groupIndex} --------------------------`);
        console.log(`------------------------------------------------------------------`);

        const linePart = line.slice(0, lineIndex);
        console.log(`linePart`, linePart);
        const isLastCharacter = lineIndex === line.length - 1;
        console.log(`isLastCharacter`, isLastCharacter);
        const checkLine = linePart.replace('?', '#');
        console.log(`checkLine`, checkLine);
        const fallbackLine = linePart.replace('?', '.');
        console.log(`fallbackLine`, fallbackLine);
        const canFitCurrentConfig = canFitGroups(checkLine, config.groups[groupIndex]);
        console.log(`canFitCurrentConfig`, canFitCurrentConfig);

        if (!canFitCurrentConfig && !isLastCharacter) {
            return getValidArrangements(config, fallbackLine + line.slice(lineIndex), lineIndex + 1, groupIndex);
        }
    }

    const line = '?###???????? 3,2,1';
    const config = getConfig(line, false);
    console.log(`config`, config);


    getValidArrangements(config, config.line, 0, 0)
})();
