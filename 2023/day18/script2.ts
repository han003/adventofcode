(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    let currentRow = 0;
    let currentColumn = 0;
    const coordinates2: { row: number, column: number }[] = [
        {row: 0, column: 0},
    ];

    let perimeter = 0;

    lines.forEach((line) => {
        const [ignoreDirection, ignoreDistance, color] = line.split(' ');
        const distanceInt = parseInt(color.substring(2, color.length - 2), 16);
        const direction = color.at(7);
        console.log(`direction`, direction);
        console.log(`color`, color);

        if (direction === '0') {
            currentColumn += distanceInt;
        }

        if (direction === '2') {
            currentColumn -= distanceInt;
        }

        if (direction === '3') {
            currentRow -= distanceInt;
        }

        if (direction === '1') {
            currentRow += distanceInt;
        }

        coordinates2.push({row: currentRow, column: currentColumn});
        perimeter += distanceInt;
    });

    const positives = coordinates2.reduce((acc, c, i, a) => {
        if (i === a.length - 1) {
            return acc;
        }

        const next = a[i + 1];

        return acc + (c.column * next.row);
    }, 0);

    const negatives = coordinates2.reduce((acc, c, i, a) => {
        if (i === a.length - 1) {
            return acc;
        }

        const next = a[i + 1];

        return acc + (c.row * next.column);
    }, 0);

    const shoelace = Math.abs(positives - negatives);
    console.log(`shoelace`, shoelace, shoelace / 2);
    console.log(`perimeter`, perimeter, (perimeter / 2) + 1);
    const answer = (shoelace / 2) + ((perimeter / 2) + 1);
    console.log(`answer`, answer);

    console.log(`Time:`, performance.now() - start);
})();
