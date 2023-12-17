"use strict";
(function () {
    console.clear();
    function getLines() {
        return require('fs').readFileSync('./day4/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    }
    function getCards() {
        return getLines().map(line => {
            console.log(`line`, line);
            const split = line.slice(line.indexOf(':') + 1).split('|');
            const winningNumbers = split[0].trim().split(' ').map(x => parseInt(x));
            const myNumbers = split[1].trim().split(' ').map(x => parseInt(x)).filter(x => !isNaN(x));
            const equalNumbers = myNumbers.filter(n => winningNumbers.includes(n));
            return {
                winningNumbers,
                myNumbers,
                equalNumbers: equalNumbers,
                points: equalNumbers.length ? 2 ** (equalNumbers.length - 1) : 0,
            };
        });
    }
    const cards = getCards();
    console.log(`cards`, cards);
    const sum = cards.reduce((sum, c) => sum + c.points, 0);
    console.log(`sum`, sum);
})();
//# sourceMappingURL=script.js.map