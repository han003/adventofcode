"use strict";
(function () {
    console.clear();
    const race = { time: 40817772, distance: 219101213651089, wins: 0 };
    console.log(`race`, race);
    function canWin(time, distance, holdTime) {
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
//# sourceMappingURL=script2.js.map