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

    hashList.forEach((hash) => {
        if (hash.includes('-')) {
            const [ lensLabel, focalStrength ] = hash.split('-');
            const currentBox = hashAlogorithm(lensLabel);
            const sameBox = lensLabelToBoxMap.get(lensLabel) === currentBox;

            if (sameBox) {
                const lensIndex = lensLabelIndexesMap.get(lensLabel)!;
                boxes[currentBox].splice(lensIndex, 1);
                lensLabelToBoxMap.delete(lensLabel);
                lensLabelIndexesMap.delete(lensLabel);

                Array.from(lensLabelToBoxMap.entries()).forEach(([ lensLabel, box ]) => {
                    if (box === currentBox) {
                        const oldIndex = lensLabelIndexesMap.get(lensLabel);
                        if (oldIndex != undefined && oldIndex > lensIndex) {
                            lensLabelIndexesMap.set(lensLabel, oldIndex - 1);
                        }
                    }
                });
            }
        } else {
            const [ lensLabel, focalStrength ] = hash.split('=');
            const currentBox = hashAlogorithm(lensLabel);
            const lensLabelWithFocal = `${lensLabel} ${focalStrength}`;

            // If box has label already
            if (lensLabelToBoxMap.get(lensLabel) === currentBox) {
                const lensIndex = lensLabelIndexesMap.get(lensLabel);
                if (lensIndex != undefined && lensIndex >= 0) {
                    boxes[currentBox].splice(lensIndex, 1, lensLabelWithFocal);
                }
            } else {
                lensLabelToBoxMap.set(lensLabel, currentBox);
                const labelIndex = boxes[currentBox].push(lensLabelWithFocal) - 1;
                lensLabelIndexesMap.set(lensLabel, labelIndex);
            }
        }
    });

    let sum = 0;
    boxes.forEach((box, boxIndex) => {
        if (box.length === 0) {
            return;
        }

        box.forEach((lens, lensIndex) => {
            const [ _, focalStrength ] = lens.split(' ');
            sum += (1 + boxIndex) * (lensIndex + 1) * parseInt(focalStrength);
        });
    });

    console.log(`sum`, sum);
    console.log(`time`, performance.now() - start);
})();
