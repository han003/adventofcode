"use strict";
console.clear();
let total = 0;
require('fs').readFileSync('./day1/input.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {
    const numbers = [];
    for (let i = 0; i < line.length; i++) {
        const string = line.slice(i);
        if (string.startsWith('one')) {
            numbers.push(1);
        }
        ;
        if (string.startsWith('two')) {
            numbers.push(2);
        }
        ;
        if (string.startsWith('three')) {
            numbers.push(3);
        }
        ;
        if (string.startsWith('four')) {
            numbers.push(4);
        }
        ;
        if (string.startsWith('five')) {
            numbers.push(5);
        }
        ;
        if (string.startsWith('six')) {
            numbers.push(6);
        }
        ;
        if (string.startsWith('seven')) {
            numbers.push(7);
        }
        ;
        if (string.startsWith('eight')) {
            numbers.push(8);
        }
        ;
        if (string.startsWith('nine')) {
            numbers.push(9);
        }
        ;
        if (string.startsWith('1')) {
            numbers.push(1);
        }
        ;
        if (string.startsWith('2')) {
            numbers.push(2);
        }
        ;
        if (string.startsWith('3')) {
            numbers.push(3);
        }
        ;
        if (string.startsWith('4')) {
            numbers.push(4);
        }
        ;
        if (string.startsWith('5')) {
            numbers.push(5);
        }
        ;
        if (string.startsWith('6')) {
            numbers.push(6);
        }
        ;
        if (string.startsWith('7')) {
            numbers.push(7);
        }
        ;
        if (string.startsWith('8')) {
            numbers.push(8);
        }
        ;
        if (string.startsWith('9')) {
            numbers.push(9);
        }
        ;
    }
    if (numbers.length) {
        console.log(`numbers`, numbers);
        const first = numbers[0];
        const last = numbers.reverse()[0];
        const number = parseInt(String(first) + String(last));
        console.log(`number`, number);
        total += number;
    }
});
console.log(`total`, total);
//# sourceMappingURL=script.js.map