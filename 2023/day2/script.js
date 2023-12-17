"use strict";
(function () {
    console.clear();
    function getLines() {
        return require('fs').readFileSync('./day2/input.txt', 'utf-8').split(/\r?\n/).filter((l) => l?.length);
    }
    function getGameId(line) {
        return line.slice(0, line.indexOf(':')).replaceAll(/\D/gi, '');
    }
    function getSets(line) {
        const noId = line.slice(line.indexOf(':') + 1).trim();
        return noId.split(';').reduce((acc, set) => {
            const cubes = set.split(',').map((c) => c.trim().split(' '));
            const setMap = new Map();
            cubes.forEach(([count, type]) => {
                setMap.set(type, Number(count));
            });
            acc.push(setMap);
            return acc;
        }, []);
    }
    let sumPossibleGames = 0;
    const bagRed = 12;
    const bagBlue = 14;
    const bagGreen = 13;
    getLines().forEach((line) => {
        console.log(line);
        const gameId = getGameId(line);
        console.log(gameId);
        const sets = getSets(line);
        const possible = sets.every(set => {
            console.log(`set`, set);
            return (set.get('red') || 0) <= bagRed &&
                (set.get('blue') || 0) <= bagBlue &&
                (set.get('green') || 0) <= bagGreen;
        });
        console.log(`possible`, possible);
        if (possible) {
            sumPossibleGames += parseInt(gameId);
        }
        console.log(`---------------------------`);
    });
    console.log(`sumPossibleGames`, sumPossibleGames);
})();
//# sourceMappingURL=script.js.map