(function () {
    enum HandType {
        HighCard,
        OnePair,
        TwoPairs,
        ThreeOfAKind,
        FullHouse,
        FourOfAKind,
        FiveOfAKind,
    }

    type Hand = Map<string, number>;

    interface CamelCard {
        originalHand: string;
        hand: Hand;
        handType: HandType;
        bid: number;
    }

    function getLines(): string[] {
        return require('fs').readFileSync('./day7/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length);
    }

    const lines = getLines();
    const start = performance.now();

    console.clear();

    const cards = new Map([
        ['J', 1],
        ['2', 2],
        ['3', 3],
        ['4', 4],
        ['5', 5],
        ['6', 6],
        ['7', 7],
        ['8', 8],
        ['9', 9],
        ['T', 10],
        ['Q', 11],
        ['K', 12],
        ['A', 13],
    ]);

    function toHand(string: string) {
        return string.split('').reduce((acc, card) => {
            acc.set(card, (acc.get(card) || 0) + 1);
            return acc;
        }, new Map<string, number>());
    }

    function isFiveOfAKind(hand: Hand) {
        return Array.from(hand.values()).some((v) => v === 5);
    }

    function isFourOfAKind(hand: Hand) {
        return Array.from(hand.values()).some((v) => v === 4);
    }

    function isFullHouse(hand: Hand) {
        const values = Array.from(hand.values())
        return values.length === 2 && values.some((v) => v === 3);
    }

    function isThreeOfAKind(hand: Hand) {
        return Array.from(hand.values()).some((v) => v === 3);
    }

    function isTwoPairs(hand: Hand) {
        const values = Array.from(hand.values());
        return values.length === 3 && values.filter((v) => v === 2).length === 2;
    }

    function isPair(hand: Hand) {
        return Array.from(hand.values()).some((v) => v === 2);
    }

    function getHighCard(hand: Hand) {
        return Math.max(...Array.from(hand.keys()).map((k) => cards.get(k)!));
    }

    function getHandType(hand: Hand): HandType {
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

    function getStrongestLabelOnHand(hand: string) {
        return Array.from(toHand(hand).keys()).sort((a, b) => {
            return cards.get(b)! - cards.get(a)!;
        })[0];
    }

    function getStrongestLabel(a: string, b: string, index = 0) {
        const aVal = cards.get(a.charAt(index))!;
        const bVal = cards.get(b.charAt(index))!;

        if (aVal === bVal) {
            return getStrongestLabel(a, b, index + 1);
        }

        return bVal - aVal;
    }

    function getBestHand(handString: string) {
        let bestHand = handString;
        const hand = toHand(handString);

        switch (hand.get('J')) {
            case 5:
                bestHand = 'AAAAA';
            case 4:
            case 3: // JJJ and (XX or (X and Y))
                bestHand = handString.replaceAll('J', getStrongestLabelOnHand(handString));
                break;
            case 2:
                const twoHand = toHand(handString);

                switch (Array.from(twoHand.keys()).length) {
                    case 2: // JJ and XXX
                        bestHand = handString.replaceAll('J', getStrongestLabelOnHand(handString));
                        break;
                    case 3: // JJ and XX and Y
                        const replace = Array.from(twoHand.entries()).find(([label, number]) => label !== 'J' && number === 2)![0];
                        bestHand = handString.replaceAll('J', replace);
                        break;
                    case 4: // JJ and X and Y and Z
                        bestHand = handString.replaceAll('J', getStrongestLabelOnHand(handString));
                        break;
                }

                break;
            case 1:
                bestHand = handString;

                bestHand = Array.from(cards.keys()).map(label => {
                    const test = handString.replace('J', label);
                    const handType = getHandType(toHand(test));

                    return {
                        string: test,
                        handType,
                    }
                }).sort((a, b) => {
                    return b.handType - a.handType || getStrongestLabel(a.string, b.string);
                })[0].string;

                break;
        }

        return bestHand;
    }

    function toCamelCard(line: string): CamelCard {
        const [hand, bid] = line.split(' ');
        const originalHand = hand;
        const bestHand = hand.includes('J') ? getBestHand(hand) : hand;

        return {
            originalHand,
            hand: toHand(bestHand),
            handType: getHandType(toHand(bestHand)),
            bid: parseInt(bid),
        };
    }

    const camelCards: CamelCard[] = lines.map(toCamelCard);
    const camelByStrength = camelCards.sort((a, b) => {
        return b.handType - a.handType || getStrongestLabel(a.originalHand, b.originalHand);
    });

    let winnings = 0;
    camelByStrength.reverse().forEach((camel, index) => {
        winnings += (camel.bid * (index + 1));
    });

    console.log(`winnings`, winnings, winnings === 251824095);

    console.log(`time`, performance.now() - start);
})();
