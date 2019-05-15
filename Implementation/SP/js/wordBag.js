class WordBag {
    constructor(sequence) {
        this.bag = {};
        if(sequence !== undefined){
            for(var i = 0; i < sequence.length; i++) {
                this.increment(sequence[i]);
            }
        }
    }

    increment(name) {
        if(!this.hasKey(name)) this.insert(name, 0);
        this.bag[name]++;
    }

    insert(name, count) {
        this.bag[name] = count;
    }

    hasKey(value){
        for(var key of this.keys()) {
            if(value == key) return true;
        }
        return false;
    }

    getCount(name) {
        return this.bag[name];
    }

    getBag() {
        return this.bag;
    }

    keys() {
        return Object.keys(this.bag);
    }

    printBag() {
        for(var key of this.keys()) {
            console.log(key + " : " + this.bag[key]);
        }
    }

    merge(bag) {
        for(var key of bag.keys()) {
            if(this.hasKey(key)) {
                this.bag[key] = this.bag[key] + bag.bag[key];
            }
            else {
                this.insert(key, bag.bag[key]);
            }
        }
    }
};
