(function () {
    const input = require('fs').readFileSync(require('path').resolve(__dirname, 'input.txt'), 'utf-8') as string;
    const start = performance.now();
    const lines = (input.split(/\r?\n/) as string[]).filter((l) => l.length);

    type Category = 'x' | 'm' | 'a' | 's';

    type Rating = Record<Category, { min: number, max: number }>

    const workflows = new Map<string, Workflow>();
    const parts: Part[] = [];

    function getRatingCombinations(rating: Rating) {
        return (rating.x.max - rating.x.min + 1) * (rating.m.max - rating.m.min + 1) * (rating.a.max - rating.a.min + 1) * (rating.s.max - rating.s.min + 1)
    }

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
                console.log(`Check TRUE`, this.category, this.case, this.number);

                if (this.case === '<') {
                    rating[this.category].max = Math.min(this.number - 1, rating[this.category].max);
                } else {
                    rating[this.category].min = Math.max(this.number + 1, rating[this.category].min);
                }

                console.log(`rating`, rating);
            }

            return rating;
        }

        getValueRequiredForFalse(rating: Rating) {
            if (this.category && this.case && this.number) {
                console.log(`Check FALSE`, this.category, this.case, this.number);

                if (this.case === '<') {
                    rating[this.category].min = Math.max(this.number, rating[this.category].min);
                } else {
                    rating[this.category].max = Math.min(this.number, rating[this.category].max);
                }

                console.log(`rating`, rating);
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
            const flow = Array.from(workflows.entries()).find(([_, value]) => value.rules.find((rule) => rule.nextWorkflow === (key || this.key)))?.[1];
            if (!flow) {
                return null;
            }

            return flow;
        }

        combinationsAvailable(rule: Rule) {
            if (this.key === 'in') {
                return 0;
            }

            let rating: Rating = {
                x: {min: 1, max: 4000},
                m: {min: 1, max: 4000},
                a: {min: 1, max: 4000},
                s: {min: 1, max: 4000},
            }

            rating = rule.getValueRequiredForTrue(rating);

            this.rules.filter(r => r.index < rule.index).forEach((r) => {
                rating = r.getValueRequiredForFalse(rating);
            });

            let fromKey = this.key;
            let currentFlow: Workflow | null | undefined = this.getPreviousWorkflow();

            while (currentFlow) {
                const rule = currentFlow.rules.find((rule) => rule.nextWorkflow === fromKey);
                if (!rule) {
                    currentFlow = null;
                    break;
                }

                // If rule is the last in the flow, all previous rules must be false
                if (rule.index === currentFlow.rules.length - 1) {
                    currentFlow.rules.filter(r => r.index < rule.index).forEach((r) => {
                        rating = r.getValueRequiredForFalse(rating);
                    });
                } else {
                    rating = rule.getValueRequiredForTrue(rating);

                    currentFlow.rules.filter(r => r.index < rule.index).forEach((r) => {
                        rating = r.getValueRequiredForFalse(rating);
                    });
                }

                fromKey = currentFlow.key;
                currentFlow = currentFlow.getPreviousWorkflow();
            }

            return getRatingCombinations(rating);
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

    let totalCombinations = 0;
    workflows.forEach((workflow) => {

        const acceptRules = workflow.rules.filter((rule) => rule.canAccept);
        acceptRules.forEach((rule) => {
            const available = workflow.combinationsAvailable(rule);
            totalCombinations += available;
            console.log(`------- ${workflow.key}`, rule.index, available.toExponential());
        });
    });

    console.log(`goal combinations`, 167409079868000);
    console.log(`totalCombinations`, totalCombinations, (totalCombinations - 167409079868000).toExponential());

    console.log(`Time:`, performance.now() - start);
})();
