(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Category = 'x' | 'm' | 'a' | 's';

    const workflows = new Map<string, Workflow>();
    const parts: Part[] = [];

    class Rule {
        category?: Category;
        case?: '>' | '<';
        number?: number;
        nextWorkflow: string | 'A' | 'R';

        constructor(ruleData: string) {
            if (ruleData.includes(':')) {
                this.category = ruleData.substring(0, 1) as Category;
                this.case = ruleData.substring(1, 2) as '<' | '>';
                this.number = parseInt(ruleData.substring(2, ruleData.indexOf(':')));
                this.nextWorkflow = ruleData.substring(ruleData.indexOf(':') + 1);
            } else {
                this.nextWorkflow = ruleData;
            }
        }

        test(part: Part) {
            const partNumber = this.category ? part[this.category] : null;

            if (this.category && this.case && this.number && partNumber) {
                if (this.case === '<') {
                    return partNumber < this.number;
                } else {
                    return partNumber > this.number;
                }
            }

            return true;
        }
    }

    class Workflow {
        key = '';
        rules: Rule[] = [];

        constructor(workflowData: string) {
            this.key = workflowData.substring(0, workflowData.indexOf('{'));
            this.rules = workflowData.substring(workflowData.indexOf('{') + 1, workflowData.length - 1).split(',').map(r => new Rule(r));
        }

        next(part: Part): 'A' | 'R' | undefined {
            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];

                if (rule.test(part)) {
                    if (rule.nextWorkflow === 'A') {
                        return 'A'
                    } else if (rule.nextWorkflow === 'R') {
                        return 'R';
                    } else {
                        return workflows.get(rule.nextWorkflow)!.next(part);
                    }
                }
            }
        }
    }

    class Part {
        x = 0;
        m = 0;
        a = 0;
        s = 0;

        constructor(partData: string[]) {
            partData.forEach((data) => {
                const [category, value] = data.split('=');
                this[category as Category] = parseInt(value);
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
        } else {
            const workflow = new Workflow(line);
            workflows.set(workflow.key, workflow);
        }
    });

    let totalOfAllParts = 0;
    parts.forEach((part) => {
        const status = workflows.get('in')!.next(part);

        if (status === 'A') {
            totalOfAllParts += part.totalRating;
        }
    });

    console.log(`totalOfAllParts`, totalOfAllParts);

    console.log(`Time:`, performance.now() - start);
})();
