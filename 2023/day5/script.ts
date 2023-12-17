(function () {
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

    const maps: AlmanacMap[] = [];
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
        maps.push({
            destination: currentDestination as MapSource,
            source: currentSource as MapSource,
            destinationRangeStart,
            destinationRangeEnd: destinationRangeStart + rangeLength - 1,
            sourceRangeStart,
            sourceRangeEnd: sourceRangeStart + rangeLength - 1,
            rangeLength,
        });
    });

    console.log(`maps`, maps);

    function getLocation(index: number, source: MapSource, destination: MapSource) {
        if (source === 'location') {
            return index;
        }

        console.log(`GET`, source, index);
        const sourceMaps = maps.filter((m) => m.source === source);
        const destinationMap = sourceMaps.find((m) => index >= m.sourceRangeStart && index <= m.sourceRangeEnd);
        console.log(`destinationMap`, destinationMap);
        let destinationIndex = index;

        if (destinationMap) {
            const diff = index - destinationMap.sourceRangeStart;
            destinationIndex = destinationMap.destinationRangeStart + diff;
        }

        console.log(`destinationIndex`, destinationIndex);

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

    const locations: number[] = [];
    seeds.forEach((seed) => {
        console.log(`-----------------------------------------------------`, );
        const location = getLocation(seed, 'seed', 'soil');
        console.log(`SEED`, seed, location);
        locations.push(location);
    });

    console.log(`closest`, Math.min(...locations));
})();
