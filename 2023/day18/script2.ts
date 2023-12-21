(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    let currentRow = 0;
    let currentColumn = 0;
    const coordinates2: { row: number, column: number }[] = [];

    let perimeter = 0;

    lines.forEach((line) => {
        const part: number = 2;
        let [ direction, distance, color ] = line.split(' ');
        const colorNumbers = color.substring(2, color.length - 1);
        const distanceInt = part === 1 ? parseInt(distance) : parseInt(colorNumbers.slice(0, 5), 16);
        direction = part === 1 ? direction : colorNumbers.charAt(colorNumbers.length - 1);

        if (part === 1) {
            if (direction === 'R') {
                direction = '0';
            }
            if (direction === 'L') {
                direction = '2';
            }
            if (direction === 'U') {
                direction = '3';
            }
            if (direction === 'D') {
                direction = '1';
            }
        }

        console.assert(!isNaN(distanceInt), `Invalid distance: ${distance}`);
        console.assert(distanceInt >= 0, `Invalid distance: ${distance}`);
        console.assert(direction === '0' || direction === '1' || direction === '2' || direction === '3', `Invalid direction: ${direction}`);

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

        coordinates2.push({ row: currentRow, column: currentColumn });
        perimeter += distanceInt;
    });

    coordinates2.forEach((c) => {
        console.log(`c`, c);
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

    const shoelace = Math.abs(positives - negatives) / 2;
    console.log(`shoelace`, shoelace);
    const interior = shoelace - (perimeter / 2) + 1;
    console.log(`interior`, interior);
    console.log(`perimeter`, perimeter);

    const answer = interior + perimeter;
    console.log(`answer`, answer);

    console.log(`Time:`, performance.now() - start);
})();
