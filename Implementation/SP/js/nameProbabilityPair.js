'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var NameProbabilityPair = (function(){
    function NameProbabilityPair(name, value) {
        this.name = name;
        this.value = value;
    }

    NameProbabilityPair.prototype.compare = function(comp) {
        if(this.value > comp.value) {
            return this;
        }
        return comp;
    }

    return NameProbabilityPair;
}());

exports.default = {
    NameProbabilityPair : NameProbabilityPair
};

module.exports = exports['default'];
