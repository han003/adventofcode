"use strict";
(function () {
    function getLines() {
        return require('fs').readFileSync('./day7/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    }
    let HandType;
    (function (HandType) {
        HandType[HandType["HighCard"] = 0] = "HighCard";
        HandType[HandType["OnePair"] = 1] = "OnePair";
        HandType[HandType["TwoPairs"] = 2] = "TwoPairs";
        HandType[HandType["ThreeOfAKind"] = 3] = "ThreeOfAKind";
        HandType[HandType["FullHouse"] = 4] = "FullHouse";
        HandType[HandType["FourOfAKind"] = 5] = "FourOfAKind";
        HandType[HandType["FiveOfAKind"] = 6] = "FiveOfAKind";
    })(HandType || (HandType = {}));
    (function () {
        const start = performance.now();
        console.clear();
        const cards = new Map([
            ['2', 2],
            ['3', 3],
            ['4', 4],
            ['5', 5],
            ['6', 6],
            ['7', 7],
            ['8', 8],
            ['9', 9],
            ['T', 10],
            ['J', 11],
            ['Q', 12],
            ['K', 13],
            ['A', 14],
        ]);
        function toHand(string) {
            return string.split('').reduce((acc, card) => {
                acc.set(card, (acc.get(card) || 0) + 1);
                return acc;
            }, new Map());
        }
        function isFiveOfAKind(hand) {
            return Array.from(hand.values()).some((v) => v === 5);
        }
        function isFourOfAKind(hand) {
            return Array.from(hand.values()).some((v) => v === 4);
        }
        function isFullHouse(hand) {
            const values = Array.from(hand.values());
            return values.length === 2 && values.some((v) => v === 3);
        }
        function isThreeOfAKind(hand) {
            return Array.from(hand.values()).some((v) => v === 3);
        }
        function isTwoPairs(hand) {
            const values = Array.from(hand.values());
            return values.length === 3 && values.filter((v) => v === 2).length === 2;
        }
        function isPair(hand) {
            return Array.from(hand.values()).some((v) => v === 2);
        }
        function getHighCard(hand) {
            return Math.max(...Array.from(hand.keys()).map((k) => cards.get(k)));
        }
        function getHandType(hand) {
            if (isFiveOfAKind(hand)) {
                return HandType.FiveOfAKind;
            }
            if (isFourOfAKind(hand)) {
                return HandType.FourOfAKind;
            }
            if (isFullHouse(hand)) {
                return HandType.FullHouse;
            }
            if (isThreeOfAKind(hand)) {
                return HandType.ThreeOfAKind;
            }
            if (isTwoPairs(hand)) {
                return HandType.TwoPairs;
            }
            if (isPair(hand)) {
                return HandType.OnePair;
            }
            return HandType.HighCard;
        }
        function getStrongestLabel(a, b, index = 0) {
            const aVal = cards.get(a.charAt(index));
            const bVal = cards.get(b.charAt(index));
            if (aVal === bVal) {
                return getStrongestLabel(a, b, index + 1);
            }
            return bVal - aVal;
        }
        const camelCards = getLines().map(line => {
            const [hand, bid] = line.split(' ');
            return {
                originalHand: hand,
                hand: toHand(hand),
                handType: getHandType(toHand(hand)),
                bid: parseInt(bid),
            };
        });
        const camelByStrength = camelCards.sort((a, b) => {
            return b.handType - a.handType || getStrongestLabel(a.originalHand, b.originalHand);
        });
        let winnings = 0;
        camelByStrength.reverse().forEach((camel, index) => {
            winnings += (camel.bid * (index + 1));
        });
        console.log(`winnings`, winnings);
        console.log(`time`, performance.now() - start);
    })();
})();
//# sourceMappingURL=script.js.map