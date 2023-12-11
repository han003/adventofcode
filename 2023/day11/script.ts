(function() {
    const lines = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();

    function showStarMap(lines: string[]) {
        console.group('Star map');
        lines.forEach((line) => {
            console.log(line);
        });
        console.groupEnd();
    }

    showStarMap(lines);

    console.log(`time`, performance.now() - start);

    let lines2: string[] = [];
    lines.forEach((line) => {
        const empty = line.replaceAll('.', '').length === 0;
        console.log(`line`, line, empty);

        if (empty) {
            lines2 = lines2.concat([ line, line ]);
        } else {
            lines2.push(line);
        }
    });

    showStarMap(lines2);
})();
