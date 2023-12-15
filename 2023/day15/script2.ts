(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();

    function hashAlogorithm(string: string) {
        let currentValue = 0;

        for (let i = 0; i < string.length; i++) {
            const charCode = string.charCodeAt(i);

            currentValue += charCode;
            currentValue *= 17;
            currentValue %= 256;
        }

        return currentValue;
    }

    const lensLabelIndexesMap = new Map<string, number>();
    const lensLabelToBoxMap = new Map<string, number>();
    const boxes: string[][] = Array.from({ length: 256 }, () => []);
    console.log(`boxes`, boxes);
    const hashList = input.replaceAll('\r\n', '').split(',');
    console.log(`hashList`, hashList);

    hashList.forEach((hash) => {
        console.log(`${hash} --------------------------------`);

        if (hash.includes('-')) {
            const [ lensLabel, focalStrength ] = hash.split('-');
            const box = hashAlogorithm(lensLabel);
            console.log(`box`, box);
            console.log(`lensLabel`, lensLabel);
            console.log(`focalStrength`, focalStrength);

            const sameBox = lensLabelToBoxMap.get(lensLabel) === box;
            console.log(`sameBox`, sameBox);
            if (sameBox) {
                console.log(`remove lens from`, box);
                const lensIndex = lensLabelIndexesMap.get(lensLabel)!;
                console.log(`lensIndex`, lensIndex);
                boxes[box].splice(lensIndex, 1);

                lensLabelToBoxMap.delete(lensLabel);
                lensLabelIndexesMap.delete(lensLabel);
                console.log(`lensLabelIndexesMap`, lensLabelIndexesMap);
            }
        } else {
            const [ lensLabel, focalStrength ] = hash.split('=');
            const box = hashAlogorithm(lensLabel);
            const lensLabelWithFocal = `${lensLabel} ${focalStrength}`;

            // If box has label already
            if (lensLabelToBoxMap.get(lensLabel)) {
                console.log(`box`, box, 'already has', lensLabel);
                const lensIndex = lensLabelIndexesMap.get(lensLabel)!;
                boxes[box].splice(lensIndex, 1, lensLabelWithFocal);
            } else {
                lensLabelToBoxMap.set(lensLabel, box);
                lensLabelIndexesMap.set(lensLabel, boxes[box].push(lensLabelWithFocal) - 1);
            }
        }

        boxes.forEach((box, index) => {
            if (box.length >= 1) {
                console.log(`box`, index, box);
            }
        });
    });

    boxes.forEach((box, index) => {
        if (box.length > 1) {
            console.log(`box`, index, box);
        }
    });

    console.log(`time`, performance.now() - start);
})();
