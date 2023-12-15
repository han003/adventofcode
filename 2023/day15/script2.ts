(function() {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
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
    const hashList = input.replaceAll('\r\n', '').split(',');

    hashList.forEach((hash, i, arr) => {
        console.log(i+1, '/', arr.length);
        // console.log(`-------------------------------------------------`);
        // console.log(`${hash} --------------------------------`);
        // console.log(`-------------------------------------------------`);

        // boxes.forEach((box, index) => {
        //     if (box.length >= 1) {
        //         console.log(`box`, index, box);
        //     }
        // });

        if (hash.includes('-')) {
            const [ lensLabel, focalStrength ] = hash.split('-');
            const currentBox = hashAlogorithm(lensLabel);
            // console.log(`box`, currentBox);
            // console.log(`lensLabel`, lensLabel);
            // console.log(`focalStrength`, focalStrength);

            const sameBox = lensLabelToBoxMap.get(lensLabel) === currentBox;
            // console.log(`sameBox`, sameBox);
            if (sameBox) {
                // console.log(`remove lens from`, currentBox);
                const lensIndex = lensLabelIndexesMap.get(lensLabel)!;
                // console.log(`lensIndex`, lensIndex);
                boxes[currentBox].splice(lensIndex, 1);

                lensLabelToBoxMap.delete(lensLabel);
                lensLabelIndexesMap.delete(lensLabel);
                // console.log(`lensLabelIndexesMap`, lensLabelIndexesMap);

                Array.from(lensLabelToBoxMap.entries()).forEach(([ lensLabel, box ]) => {
                    if (box === currentBox) {
                        // console.log(`UPDATE INDEX OF`, lensLabel);
                        const oldIndex = lensLabelIndexesMap.get(lensLabel)!;
                        lensLabelIndexesMap.set(lensLabel, oldIndex - 1);
                    }
                });
            }
        } else {
            const [ lensLabel, focalStrength ] = hash.split('=');
            const currentBox = hashAlogorithm(lensLabel);
            const lensLabelWithFocal = `${lensLabel} ${focalStrength}`;

            // If box has label already
            if (lensLabelToBoxMap.get(lensLabel)) {
                // console.log(`box`, currentBox, 'already has', lensLabel);
                const lensIndex = lensLabelIndexesMap.get(lensLabel)!;
                // console.log(`replace`, 'at', lensIndex);
                // console.log(`lensLabelIndexesMap`, lensLabelIndexesMap);
                boxes[currentBox].splice(lensIndex, 1, lensLabelWithFocal);
            } else {
                lensLabelToBoxMap.set(lensLabel, currentBox);
                lensLabelIndexesMap.set(lensLabel, boxes[currentBox].push(lensLabelWithFocal) - 1);
                // console.log(`lensLabelIndexesMap`, lensLabelIndexesMap);
            }
        }

        // boxes.forEach((box, index) => {
        //     if (box.length >= 1) {
        //         console.log(`box`, index, box);
        //     }
        // });
    });

    let sum = 0;
    boxes.forEach((box, boxIndex) => {
        if (box.length === 0) {
            return;
        }

        console.log(`box`, boxIndex, box);
        box.forEach((lens, lensIndex) => {
            const [ lensLabel, focalStrength ] = lens.split(' ');
            sum += (1 + boxIndex) * (lensIndex + 1) * parseInt(focalStrength);
        });
    });

    console.log(`sum`, sum);

    console.log(`time`, performance.now() - start);
})();
