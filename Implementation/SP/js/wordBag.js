'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var WordBag = (function(){
    function WordBag(sequence) {
        this.bag = {};
        if(sequence !== undefined){
            for(var i = 0; i < sequence.length; i++) {
                this.increment(sequence[i]);
            }
        }
    }

    WordBag.prototype.increment = function(name) {
        if(!this.hasKey(name)) this.insert(name, 0);
        this.bag[name]++;
    }

    WordBag.prototype.insert = function(name, count) {
        this.bag[name] = count;
    }

    WordBag.prototype.hasKey = function(value){
        for(var key of this.keys()) {
            if(value == key) return true;
        }
        return false;
    }

    WordBag.prototype.getCount = function(name) {
        return this.bag[name];
    }

    WordBag.prototype.getBag = function() {
        return this.bag;
    }

    WordBag.prototype.keys = function() {
        return Object.keys(this.bag);
    }

    WordBag.prototype.printBag = function() {
        for(var key of this.keys()) {
            console.log(key + " : " + this.bag[key]);
        }
    }

    WordBag.prototype.merge = function(bag) {
        for(var key of bag.keys()) {
            if(this.hasKey(key)) {
                this.bag[key] = this.bag[key] + bag.bag[key];
            }
            else {
                this.insert(key, bag.bag[key]);
            }
        }
    }

    return WordBag;
}());

exports.default = {
    WordBag : WordBag
};

module.exports = exports['default'];
