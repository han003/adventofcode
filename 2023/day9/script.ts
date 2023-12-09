(function () {
    const answer = 1647269739;
    const lines = require('fs').readFileSync('./day9/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length) as string[];
    const start = performance.now();
    console.clear();

    const histories = lines.reduce((acc, line) => {
        acc.push({
            history: line.split(' ').map((l) => parseInt(l)),
            oldHistories: [],
            value: 0,
        });

        return acc;
    }, [] as {history: number[], oldHistories: number[][], value: number}[])

    function findOldHistories(history: number[], oldHistories: number[][] = []) {
        const found: number[] = [];

        for (let i = 0; i < history.length - 1; i++) {
            const next = history[i + 1];
            const diff = next - history[i];
            found.push(diff);
        }

        if (found.every((f) => f === 0)) {
            return [...oldHistories, found];
        }

        return findOldHistories(found, [...oldHistories, found]);
    }

    function findNextValue(history: number[], oldHistories: number[][] = []) {
        let previousPushedValue = 0;

        oldHistories.reverse().forEach((oldHistory, i) => {
            if (i === 0) {
                previousPushedValue = 0;
                oldHistory.push(previousPushedValue);
                return;
            }
            if ( i === 1) {
                previousPushedValue = oldHistory[0];
                oldHistory.push(previousPushedValue);
                return;
            }

            previousPushedValue = oldHistory[oldHistory.length - 1] + previousPushedValue;
            oldHistory.push(previousPushedValue);
        });

        return history[history.length - 1] + previousPushedValue;
    }

    histories.forEach(h => {
        h.oldHistories = findOldHistories(h.history);
        h.value = findNextValue(h.history, h.oldHistories);
    });

    console.log(`histories`, histories.reduce((sum, h) => sum + h.value, 0));

    console.log(`time`, performance.now() - start);
})();
