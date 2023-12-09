function getLines(): string[] {
    return require('fs').readFileSync('./day6/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length);
}

interface Race {
    time: number;
    distance: number;
    wins: number;
}

(function(){

    console.clear();

    const lines = getLines();
    console.log(`lines`, lines);

    const races: Race[] = [];
    const times = lines[0].replace('Time:', '').trim().split(' ').map((s) => parseInt(s)).filter((n) => !isNaN(n));
    console.log(`times`, times);
    const distances = lines[1].replace('Distance:', '').trim().split(' ').map((s) => parseInt(s)).filter((n) => !isNaN(n));
    console.log(`distances`, distances);

    times.forEach((time, i) => {
        races.push({
            time,
            distance: distances[i],
            wins: 0,
        })
    });

    console.log(`races`, races);

    function canWin(time: number, distance: number, holdTime: number) {
        const speed = holdTime;
        const remainingTime = time - holdTime;
        return speed * remainingTime > distance;
    }

    races.forEach(r => {
        for (let i = 0; i < r.time; i++) {
            if (canWin(r.time, r.distance, i)) {
                r.wins++;
            }
        }
    });

    console.log(`racees`, races);

    const margin = races.map(r => r.wins).reduce((a, b) => a * b, 1);

    console.log(`margin of error`, margin);
})();
