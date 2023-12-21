"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input-2.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    class Module {
        constructor(id) {
            this.inputModules = [];
            this.destinationModules = [];
            this.state = 'off';
            this.id = id;
        }
        addInputModule(module) {
            this.inputModules.push(module);
        }
        removeInputModule(module) {
            this.inputModules = this.inputModules.filter((m) => m.id !== module.id);
        }
        addDestinationModule(module) {
            this.destinationModules.push(module);
        }
        removeDestinationModule(module) {
            this.destinationModules = this.destinationModules.filter((m) => m.id !== module.id);
        }
    }
    class UntypedModule extends Module {
        constructor() {
            super(...arguments);
            this.next = undefined;
        }
        sendPulse(pulse) {
            // Untyped modules do nothing
        }
        receivePulse(pulse) {
            // Untyped modules do nothing
        }
    }
    /**
     * Flip-flop modules (prefix %) are either on or off; they are initially off.
     * If a flip-flop module receives a high pulse, it is ignored and nothing happens. However,
     * if a flip-flop module receives a low pulse, it flips between on and off.
     * If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
     */
    class FlipFlopModule extends Module {
        constructor() {
            super(...arguments);
            this.next = undefined;
        }
        sendPulse(pulse) {
            this.destinationModules.forEach((m) => {
                console.log(`FlipFlop`, this.id, 'sends', pulse, 'to', m.id);
                m.receivePulse(pulse, this);
            });
        }
        receivePulse(pulse) {
            if (pulse === 'high') {
                return;
            }
            if (this.state === 'off') {
                this.state = 'on';
                this.next = () => {
                    this.sendPulse('high');
                    this.next = undefined;
                };
            }
            else {
                this.state = 'off';
                this.next = () => {
                    this.sendPulse('low');
                    this.next = undefined;
                };
            }
        }
    }
    /**
     * Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules;
     * they initially default to remembering a low pulse for each input. When a pulse is received,
     * the conjunction module first updates its memory for that input. Then, if it remembers
     * high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
     */
    class ConjunctionModule extends Module {
        constructor() {
            super(...arguments);
            this.next = undefined;
            this.memory = new Map();
        }
        addInputModule(module) {
            super.addInputModule(module);
            this.memory.set(module.id, 'low');
        }
        sendPulse(pulse) {
            this.destinationModules.forEach((m) => {
                console.log(`Conjunction`, this.id, 'sends', pulse, 'to', m.id);
                m.receivePulse(pulse, this);
            });
        }
        receivePulse(pulse, from) {
            this.memory.set(from.id, pulse);
            // If we have a high pulse from every input module, send a high pulse
            if (Array.from(this.memory.values()).every((p) => p === 'high')) {
                this.next = () => {
                    this.sendPulse('low');
                    this.next = undefined;
                };
            }
            else {
                this.next = () => {
                    this.sendPulse('high');
                    this.next = undefined;
                };
            }
        }
    }
    /**
     * There is a single broadcast module (named broadcaster). When it receives a pulse, it sends the same pulse to all of its destination modules.
     */
    class BroadcastModule extends Module {
        constructor() {
            super('broadcaster');
            this.next = undefined;
        }
        sendPulse(pulse) {
            this.destinationModules.forEach((m) => {
                console.log(`Broadcaster sends ${pulse} to ${m.id}`);
                m.receivePulse(pulse, this);
            });
        }
        receivePulse(pulse) {
            this.next = () => {
                this.sendPulse(pulse);
                this.next = undefined;
            };
        }
    }
    /**
     * Here at Desert Machine Headquarters, there is a module with a single button on it called, aptly, the button module.
     * When you push the button, a single low pulse is sent directly to the broadcaster module.
     */
    class ButtonModule extends Module {
        constructor(broadcastModule) {
            super('button');
            this.next = () => {
                this.sendPulse();
                this.next = undefined;
            };
            this.broadcastModule = broadcastModule;
        }
        sendPulse() {
            console.log(`Button module sends low to broadcaster`);
            this.broadcastModule.receivePulse('low');
        }
        receivePulse() {
            // Does nothing
        }
    }
    const broadcastModule = new BroadcastModule();
    const buttonModule = new ButtonModule(broadcastModule);
    const modules = [buttonModule, broadcastModule];
    const destinationModules = new Map();
    const inputModules = new Map();
    lines.forEach((line) => {
        const [source, destinations] = line.split(' -> ');
        const type = source[0];
        const id = source === 'broadcaster' ? source : source.slice(1);
        const destinationArray = destinations.split(', ');
        destinationModules.set(id, destinationArray);
        destinationArray.forEach((destination) => {
            inputModules.set(destination, inputModules.get(destination) || new Set());
            inputModules.get(destination).add(id);
        });
        console.log(`id`, id);
        console.log(`destinations`, destinations);
        if (id === 'broadcaster') {
            return;
        }
        console.log(`type`, type);
        console.log(`id`, id);
        switch (type) {
            case '%':
                modules.push(new FlipFlopModule(id));
                break;
            case '&':
                modules.push(new ConjunctionModule(id));
                break;
            default:
                modules.push(new UntypedModule(id));
        }
    });
    console.log(`modules`, modules);
    destinationModules.forEach((destinations, source) => {
        if (source === 'broadcaster') {
            destinations.forEach((destination) => {
                const destinationModule = modules.find((m) => m.id === destination);
                if (!destinationModule) {
                    throw new Error(`Destination module not found: ${destination}`);
                }
                broadcastModule.addDestinationModule(destinationModule);
            });
            return;
        }
        const sourceModule = modules.find((m) => m.id === source);
        if (!sourceModule) {
            throw new Error(`Source module not found: ${source}`);
        }
        destinations.forEach((destination) => {
            const destinationModule = modules.find((m) => m.id === destination);
            if (!destinationModule) {
                throw new Error(`Destination module not found: ${destination}`);
            }
            sourceModule.addDestinationModule(destinationModule);
        });
    });
    inputModules.forEach((sources, destination) => {
        const destinationModule = modules.find((m) => m.id === destination);
        if (!destinationModule) {
            throw new Error(`Destination module not found: ${destination}`);
        }
        sources.forEach((source) => {
            const sourceModule = modules.find((m) => m.id === source);
            if (!sourceModule) {
                throw new Error(`Source module not found: ${source}`);
            }
            destinationModule.addInputModule(sourceModule);
        });
    });
    console.log(`modules`, modules);
    buttonModule.next?.();
    broadcastModule.next?.();
    function getNexts() {
        const nexts = modules.reduce((acc, module) => module.next === undefined ? acc : acc.concat(module.next), []);
        console.log(`nexts`, nexts);
        return nexts;
    }
    let nexts = getNexts();
    while (nexts.length) {
        nexts.forEach((next) => next());
        nexts = getNexts();
    }
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map