"use strict";
(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8');
    const start = performance.now();
    const lines = input.split(/\r?\n/).filter((l) => l.length);
    const workflows = new Map();
    const parts = [];
    class Rule {
        constructor(ruleData) {
            if (ruleData.includes(':')) {
                this.category = ruleData.substring(0, 1);
                this.case = ruleData.substring(1, 2);
                this.number = parseInt(ruleData.substring(2, ruleData.indexOf(':')));
                this.nextWorkflow = ruleData.substring(ruleData.indexOf(':') + 1);
            }
            else {
                this.nextWorkflow = ruleData;
            }
        }
        test(part) {
            const partNumber = this.category ? part[this.category] : null;
            if (this.category && this.case && this.number && partNumber) {
                if (this.case === '<') {
                    return partNumber < this.number;
                }
                else {
                    return partNumber > this.number;
                }
            }
            return true;
        }
    }
    class Workflow {
        constructor(workflowData) {
            this.key = '';
            this.rules = [];
            this.key = workflowData.substring(0, workflowData.indexOf('{'));
            this.rules = workflowData.substring(workflowData.indexOf('{') + 1, workflowData.length - 1).split(',').map(r => new Rule(r));
        }
        next(part) {
            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];
                if (rule.test(part)) {
                    if (rule.nextWorkflow === 'A') {
                        return 'A';
                    }
                    else if (rule.nextWorkflow === 'R') {
                        return 'R';
                    }
                    else {
                        return workflows.get(rule.nextWorkflow).next(part);
                    }
                }
            }
        }
    }
    class Part {
        constructor(partData) {
            this.x = 0;
            this.m = 0;
            this.a = 0;
            this.s = 0;
            partData.forEach((data) => {
                const [category, value] = data.split('=');
                this[category] = parseInt(value);
            });
        }
        get totalRating() {
            return this.x + this.m + this.a + this.s;
        }
    }
    lines.forEach((line) => {
        if (line.startsWith('{')) {
            const data = line.substring(1, line.length - 1).split(',');
            parts.push(new Part(data));
        }
        else {
            const workflow = new Workflow(line);
            workflows.set(workflow.key, workflow);
        }
    });
    let totalOfAllParts = 0;
    parts.forEach((part) => {
        const status = workflows.get('in').next(part);
        if (status === 'A') {
            totalOfAllParts += part.totalRating;
        }
    });
    console.log(`totalOfAllParts`, totalOfAllParts);
    console.log(`Time:`, performance.now() - start);
})();
//# sourceMappingURL=script.js.map