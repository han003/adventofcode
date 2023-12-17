"use strict";
(function () {
    const answer = 1647269739;
    const lines = require('fs').readFileSync('./day9/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    const start = performance.now();
    console.clear();
    const histories = lines.reduce((acc, line) => {
        acc.push({
            history: line.split(' ').map((l) => parseInt(l)).filter((l) => !isNaN(l)),
            oldHistories: [],
            value: 0,
        });
        return acc;
    }, []);
    console.log(`histories`, histories);
    function findOldHistories(history, oldHistories = []) {
        const found = [];
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
    function findNextValue(history, oldHistories = []) {
        let prevValue = 0;
        oldHistories.reverse().forEach((oldHistory, i) => {
            if (i === 0) {
                prevValue = 0;
                oldHistory.unshift(prevValue);
                return;
            }
            if (i === 1) {
                prevValue = oldHistory[0];
                oldHistory.unshift(prevValue);
                return;
            }
            prevValue = oldHistory[0] - prevValue;
            oldHistory.push(prevValue);
        });
        return history[0] - prevValue;
    }
    histories.forEach(h => {
        h.oldHistories = findOldHistories(h.history);
        h.value = findNextValue(h.history, h.oldHistories);
    });
    console.log(`histories`, histories.reduce((sum, h) => sum + h.value, 0));
    console.log(`time`, performance.now() - start);
})();
//# sourceMappingURL=script2.js.map