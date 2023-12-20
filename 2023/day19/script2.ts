(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'example-input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Category = 'x' | 'm' | 'a' | 's';

    type Rating = Record<Category, { min: number, max: number }>

    const workflows = new Map<string, Workflow>();
    const parts: Part[] = [];

    class Rule {
        index = 0;
        category?: Category;
        case?: '>' | '<';
        number?: number;
        nextWorkflow: string | 'A' | 'R';

        constructor(ruleData: string, index: number) {
            this.index = index;

            if (ruleData.includes(':')) {
                this.category = ruleData.substring(0, 1) as Category;
                this.case = ruleData.substring(1, 2) as '<' | '>';
                this.number = parseInt(ruleData.substring(2, ruleData.indexOf(':')));
                this.nextWorkflow = ruleData.substring(ruleData.indexOf(':') + 1);
            } else {
                this.nextWorkflow = ruleData;
            }
        }

        getValueRequiredForTrue(rating: Rating) {
            if (this.category && this.case && this.number) {
                if (this.case === '<') {
                    rating[this.category].max = this.number - 1;
                } else {
                    rating[this.category].min = this.number + 1;
                }
            }

            return rating;
        }

        getValueRequiredForFalse(rating: Rating) {
            if (this.category && this.case && this.number) {
                if (this.case === '<') {
                    rating[this.category].min = this.number;
                } else {
                    rating[this.category].max = this.number;
                }
            }

            return rating;
        }

        get canAccept() {
            return this.nextWorkflow === 'A';
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
            this.rules = workflowData.substring(workflowData.indexOf('{') + 1, workflowData.length - 1).split(',').map((r, i) => new Rule(r, i));
        }

        get canAccept() {
            return this.rules.some((rule) => rule.canAccept);
        }

        getPreviousWorkflow(key?: string) {
            return Array.from(workflows.entries()).find(([_, value]) => value.rules.find((rule) => rule.nextWorkflow === (key || this.key)));
        }

        combinationsAvailable() {
            const acceptRules = this.rules.filter((rule) => rule.canAccept);

            if (!acceptRules.length) {
                return 0;
            }

            if (this.key === 'in') {
                return 0;
            }

            console.log(`acceptRules`, acceptRules);
            let rating: Rating = {
                x: {min: 1, max: 4000},
                m: {min: 1, max: 4000},
                a: {min: 1, max: 4000},
                s: {min: 1, max: 4000},
            }

            acceptRules.forEach((rule) => {
                rating = rule.getValueRequiredForTrue(rating);
                console.log(`rating`, rating);

                this.rules.filter(r => r.index < rule.index).forEach((prequisiteRules) => {
                    rating = prequisiteRules.getValueRequiredForFalse(rating);
                });

                console.log(`rating`, rating);
            });

            const previousFlow = this.getPreviousWorkflow();
            console.log(`previousFlow`, previousFlow);

            while (previousFlow) {

            }

            return (rating.x.max - rating.x.min) * (rating.m.max - rating.m.min) * (rating.a.max - rating.a.min) * (rating.s.max - rating.s.min);
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

    console.log(`workflows.get('px')?.combinationsAvailable()`, workflows.get('px')?.combinationsAvailable());
    console.log(`workflows.get('pv')?.combinationsAvailable()`, workflows.get('pv')?.combinationsAvailable());

    console.log(`Time:`, performance.now() - start);
})();
