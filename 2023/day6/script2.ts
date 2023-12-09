interface Race {
    time: number;
    distance: number;
    wins: number;
}

(function () {

    console.clear();

    const race: Race = {time: 40_817_772, distance: 219_101_213_651_089, wins: 0};
    console.log(`race`, race);

    function canWin(time: number, distance: number, holdTime: number) {
        const speed = holdTime;
        const remainingTime = time - holdTime;
        return speed * remainingTime > distance;
    }

    for (let i = 0; i < race.time; i++) {
        if (canWin(race.time, race.distance, i)) {
            race.wins++;
        }
    }

    console.log(`margin of error`, race.wins);
})();
