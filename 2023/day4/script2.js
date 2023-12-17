"use strict";
(function () {
    console.clear();
    function getLines() {
        return require('fs').readFileSync('./day4/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    }
    function copyCard(card, fromId) {
        return {
            id: card.id,
            winningNumbers: card.winningNumbers,
            myNumbers: card.myNumbers,
            equalNumbers: card.equalNumbers,
            copyFrom: fromId,
        };
    }
    function getCards() {
        return getLines().map((line, index) => {
            console.log(`line`, line);
            const split = line.slice(line.indexOf(':') + 1).split('|');
            const winningNumbers = split[0].trim().split(' ').map(x => parseInt(x));
            const myNumbers = split[1].trim().split(' ').map(x => parseInt(x)).filter(x => !isNaN(x));
            const equalNumbers = myNumbers.filter(n => winningNumbers.includes(n));
            return {
                id: index + 1,
                winningNumbers,
                myNumbers,
                equalNumbers: equalNumbers,
            };
        });
    }
    const originalCards = getCards().reduce((cards, card) => {
        cards[card.id] = card;
        return cards;
    }, {});
    let iterations = 0;
    const cards = getCards();
    let currentCard = cards[0];
    while (currentCard || iterations <= 1e6) {
        if (!currentCard) {
            break;
        }
        let copies = [];
        for (let i = 0; i < currentCard?.equalNumbers.length; i++) {
            const cardToCopyId = currentCard.id + i + 1;
            const cardToCopy = originalCards[cardToCopyId];
            if (cardToCopy) {
                copies.push(copyCard(cardToCopy, currentCard.id));
            }
        }
        cards.splice(iterations + 1, 0, ...copies);
        iterations += 1;
        if (cards[iterations]) {
            currentCard = cards[iterations];
        }
        else {
            currentCard = null;
        }
        if (iterations % 10000 === 0) {
            console.log(`cards to go`, cards.length - iterations);
        }
    }
    console.log(`iterations`, iterations);
})();
//# sourceMappingURL=script2.js.map