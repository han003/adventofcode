console.clear();

function getLines() {
    return require('fs').readFileSync('./day2/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length);
}

function getGameId(line: string) {
    return line.slice(0, line.indexOf(':')).replaceAll(/\D/gi, '')
}

function getSets(line: string) {
    const noId = line.slice(line.indexOf(':') + 1).trim();
    return noId.split(';').reduce((acc, set) => {
        const cubes = set.split(',').map((c) => c.trim().split(' '));
        const setMap = new Map<string, number>();

        cubes.forEach(([count, type]) => {
            setMap.set(type, Number(count));
        });

        acc.push(setMap);

        return acc;
    }, [] as Map<string, number>[]);
}

let power = 0;

getLines().forEach((line: any) => {
    console.log(line);
    const gameId = getGameId(line);
    console.log(gameId);
    const sets = getSets(line);

    const fewestRed = Math.max(...sets.map((set) => set.get('red') || 0));
    const fewestBlue = Math.max(...sets.map((set) => set.get('blue') || 0));
    const fewestGreen = Math.max(...sets.map((set) => set.get('green') || 0));

    console.log(`---------------------------`);

    power += (fewestRed * fewestBlue * fewestGreen);
});

console.log(`power`, power);
