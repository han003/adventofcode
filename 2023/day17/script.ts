(function () {
    const { Heap } = require('heap-js');
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);
    const originalBoard = lines.map((l) => l.split('').map((s) => parseInt(s)));

    type Block = {heat: number, row: number, column: number};

    const heap = new Heap((a: Block, b: Block) => a.heat - b.heat);

    const visited = new Map<string, Block>();

    heap.push({heat: 0, row: 0, column: 0});

    while (heap.length) {
        const block = heap.pop() as Block;
        const key = `${block.row},${block.column}`;

        if (visited.has(key)) {
            continue;
        }

        visited.set(key, block);

        const neighbors = [
            { row: block.row - 1, column: block.column },
            { row: block.row + 1, column: block.column },
            { row: block.row, column: block.column - 1 },
            { row: block.row, column: block.column + 1 },
        ];

        neighbors.forEach((neighbor) => {
            const neighborKey = `${neighbor.row},${neighbor.column}`;
            if (visited.has(neighborKey)) {
                return;
            }

            if (neighbor.row < 0 || neighbor.row >= originalBoard.length) {
                return;
            }

            if (neighbor.column < 0 || neighbor.column >= originalBoard[0].length) {
                return;
            }

            const neighborBlock = { row: neighbor.row, column: neighbor.column, heat: block.heat + originalBoard[neighbor.row][neighbor.column] };

            heap.push(neighborBlock);
        });
    }

    console.log(`Time:`, performance.now() - start);
})();
