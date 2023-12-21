"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input-2.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    class Module {
        constructor(id) {
            this.pulseCount = { high: 0, low: 0 };
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
                this.pulseCount[pulse]++;
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
                this.pulseCount[pulse]++;
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
                this.pulseCount[pulse]++;
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
            this.next = undefined;
            this.broadcastModule = broadcastModule;
        }
        press() {
            this.next = () => {
                this.sendPulse();
                this.next = undefined;
            };
        }
        sendPulse() {
            console.log(`Button module sends low to broadcaster`);
            this.pulseCount.low++;
            this.broadcastModule.receivePulse('low');
        }
        receivePulse() {
            // Does nothing
        }
    }
    const broadcastModule = new BroadcastModule();
    const buttonModule = new ButtonModule(broadcastModule);
    const modules = [buttonModule, broadcastModule];
    const moduleIds = new Set();
    // Get all IDs
    lines.forEach((line) => {
        const [source, destinations] = line.split(' -> ');
        const id = source.startsWith('%') || source.startsWith('&') ? source.slice(1) : source;
        moduleIds.add(id);
        destinations.split(', ').forEach((destination) => {
            moduleIds.add(destination);
        });
    });
    console.log(`Added IDs`, '-------------------------------------------------------------');
    console.log(`moduleIds`, moduleIds);
    // Create modules
    moduleIds.forEach((id) => {
        switch (true) {
            case id === 'broadcaster':
                break;
            case lines.some((line) => line.startsWith(`%${id}`)):
                modules.push(new FlipFlopModule(id));
                break;
            case lines.some((line) => line.startsWith(`&${id}`)):
                modules.push(new ConjunctionModule(id));
                break;
            default:
                modules.push(new UntypedModule(id));
                break;
        }
    });
    console.log(`Created modules`, '-------------------------------------------------------------');
    console.log(`modules`, modules);
    // Add destination modules to modules
    lines.forEach((line) => {
        const [source, destinations] = line.split(' -> ');
        const sourceId = source.startsWith('%') || source.startsWith('&') ? source.slice(1) : source;
        const sourceModule = modules.find((m) => m.id === sourceId);
        destinations.split(', ').forEach((destination) => {
            const destinationModule = modules.find((m) => m.id === destination);
            sourceModule?.addDestinationModule(destinationModule);
            destinationModule?.addInputModule(sourceModule);
        });
    });
    console.log(`Added inputs and destinations`, '-------------------------------------------------------------');
    console.log(`modules`, modules);
    buttonModule.next?.();
    broadcastModule.next?.();
    function getNexts() {
        const nexts = modules.reduce((acc, module) => module.next === undefined ? acc : acc.concat(module.next), []);
        console.log(`nexts`, nexts);
        return nexts;
    }
    for (let i = 0; i < 1000; i++) {
        console.log(`RUN {${i + 1}}`, '-------------------------------------------------------------');
        buttonModule.press();
        let nexts = getNexts();
        while (nexts.length) {
            nexts.forEach((next) => next());
            nexts = getNexts();
        }
    }
    console.log(`modules`, modules);
    const pulseCount = modules.reduce((acc, module) => {
        acc.high += module.pulseCount.high;
        acc.low += module.pulseCount.low;
        return acc;
    }, { high: 0, low: 0 });
    console.log(`pulseCount`, pulseCount);
    console.log(`answer`, pulseCount.low * pulseCount.high);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map