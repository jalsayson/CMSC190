'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

class NameProbabilityPair {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    compare(comp) {
        if(this.value > comp.value) {
            return this;
        }
        return comp;
    }
}
