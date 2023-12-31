(function(){

    console.clear();

    type MapSource = 'seed' | 'soil' | 'fertilizer' | 'water' | 'light' | 'temperature' | 'humidity' | 'location';

    interface AlmanacMap {
        source: MapSource;
        destination: MapSource;
        destinationRangeStart: number;
        destinationRangeEnd: number;
        sourceRangeStart: number;
        sourceRangeEnd: number;
        rangeLength: number;
    }

    function getLines(): string[] {
        return require('fs').readFileSync('./day5/input.txt', 'utf-8').split(/\r?\n/).filter((l: any) => l?.length);
    }

    const lines = getLines();
    console.log(`lines`, lines);
    const seeds = lines[0].replace('seeds: ', '').split(' ').map((s) => parseInt(s, 10));
    console.log(`seeds`, seeds);

    const seedRanges: { start: number; end: number }[] = [];

    for (let i = 0; i < seeds.length; i += 2) {
        seedRanges.push({
            start: seeds[i],
            end: seeds[i] + seeds[i + 1] - 1,
        });
    }

    console.log(`seedRanges`, seedRanges);

    const maps: Record<MapSource, AlmanacMap[]> = {
        seed: [],
        soil: [],
        fertilizer: [],
        water: [],
        light: [],
        temperature: [],
        humidity: [],
        location: [],
    };

    let currentDestination: MapSource | undefined;
    let currentSource: MapSource | undefined;

    lines.slice(1).forEach((l) => {
        if (l.endsWith('map:')) {
            const [source, _, destination] = l.split(' ')[0].split('-');
            currentDestination = destination as MapSource;
            currentSource = source as MapSource;
            return;
        }

        const [destinationRangeStart, sourceRangeStart, rangeLength] = l.split(' ').map((s: any) => parseInt(s, 10));

        if (currentSource && currentDestination) {
            maps[currentSource].push({
                destination: currentDestination,
                source: currentSource,
                destinationRangeStart,
                destinationRangeEnd: destinationRangeStart + rangeLength - 1,
                sourceRangeStart,
                sourceRangeEnd: sourceRangeStart + rangeLength - 1,
                rangeLength,
            });
        }
    });

    function getLocation(index: number, source: MapSource, destination: MapSource) {
        if (source === 'location') {
            return index;
        }

        const destinationMap = maps[source].find((m) => index >= m.sourceRangeStart && index <= m.sourceRangeEnd);
        let destinationIndex = index;

        if (destinationMap) {
            const diff = index - destinationMap.sourceRangeStart;
            destinationIndex = destinationMap.destinationRangeStart + diff;
        }

        switch (source) {
            case 'seed':
                return getLocation(destinationIndex, 'soil', destination);
            case 'soil':
                return getLocation(destinationIndex, 'fertilizer', destination);
            case 'fertilizer':
                return getLocation(destinationIndex, 'water', destination);
            case 'water':
                return getLocation(destinationIndex, 'light', destination);
            case 'light':
                return getLocation(destinationIndex, 'temperature', destination);
            case 'temperature':
                return getLocation(destinationIndex, 'humidity', destination);
            case 'humidity':
                return getLocation(destinationIndex, 'location', destination);
        }
    }

    let lowest = Infinity;

    seedRanges.forEach((seedRange, index, array) => {
        console.log(`Checking range`, index + 1, 'of', array.length);

        for (let i = seedRange.start; i <= seedRange.end; i++) {
            const location = getLocation(i, 'seed', 'soil');
            if (location < lowest) {
                lowest = location;
            }
        }
    });

    console.log(`closest`, lowest);
})();
