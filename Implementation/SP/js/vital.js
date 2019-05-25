/*****************************************************************
                               CLASSES
*****************************************************************/

/*---------------------------------------------------------------*/
/*--------------------- NameProbabilityPair ---------------------*/
/*---------------------------------------------------------------*/


class NameProbabilityPair {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.compare = function(comp) {
            if(this.value > comp.value) {
                return this;
            }
            return comp;
        }
    }
}

/*------------------------------------------------------------*/
/*--------------------- PredictionMatrix ---------------------*/
/*------------------------------------------------------------*/

class PredictionMatrix {
    constructor(bag = new WordBag, sequence = [], matrixObject) {
        this.printMatrix = function() {
            for(var key of this.reference['keys']) {
                for(var key2 of this.reference['keys']) {
                    console.log(this.matrix[key][key2]);
                }
            }
        }

        this.getTopRanks = function(word, ranks = 3) {
            var ranking = [];
            var result = [];

            var nppCompare = function(a, b) {
                if(a.value > b.value) return -1;
                if(a.value < b.value) return 1;
                return 0;
            }

            var keys = this.reference['keys'];
            for(var key of keys) {
                var convertedPair = this.bayesComputation(word, key);
                ranking = ranking.concat(new NameProbabilityPair(key, convertedPair));
                ranking.sort(nppCompare);
                if(ranking.length > ranks) {
                    ranking = ranking.slice(0, ranks);
                }
            }

            for(var i = 0; i < ranking.length; i++) {
                result.push(ranking[i].name);
            }

            return result;
        }

        this.bayesComputation = function(word, key) {
            var aGivenB = function(pmat, a, b) {
                return pmat.matrix[a][b];
            }

            var probOf = function(pmat, word) {
                return pmat.reference['bag'].getBag()[word]/pmat.reference['sequence'].length;
            }

            if(probOf(this, key) == 0 || aGivenB(this, key, word) == 0) {
                return 0;
            }
            else {
                return (aGivenB(this, key, word)*probOf(this, key))/probOf(this, word);
            }
        }

        this.merge = function(pm2) {
            this.reference['bag'].merge(pm2.reference['bag']);
            this.reference['keys'] = this.reference['bag'].keys();
            this.reference['sequence'] = mergeSequences(this.reference['sequence'], pm2.reference['sequence']);

            var sequence = this.reference['sequence'];

            var keys = this.reference['keys'];
            for(var key of keys) {
                this.matrix[key] = {};
                for(var key2 of keys) {
                    this.matrix[key][key2] = 0;
                }
            }

            for(var i = 1; i < sequence.length; i++) {
                this.matrix[sequence[i]][sequence[i-1]]++;
            }

            for(var key of keys) {
                for(var key2 of keys) {
                    this.matrix[key][key2] = this.matrix[key][key2]/this.reference['bag'].getBag()[key];
                }
            }
        }

        if(matrixObject === undefined) {
            this.matrix = {};
            this.reference = {
                'bag' : bag,
                'sequence' : sequence,
                'keys' : bag.keys()
            };

            var keys = this.reference['keys'];
            for(var key of keys) {
                this.matrix[key] = {};
                for(var key2 of keys) {
                    this.matrix[key][key2] = 0;
                }
            }

            for(var i = 1; i < sequence.length; i++) {
                this.matrix[sequence[i]][sequence[i-1]]++;
            }

            for(var key of keys) {
                for(var key2 of keys) {
                    this.matrix[key][key2] = this.matrix[key][key2]/this.reference['bag'].getBag()[key];
                }
            }
        }

        else {
            this.matrix = matrixObject.matrix;
            this.reference = matrixObject.reference;
        }
    }
}

/*---------------------------------------------------*/
/*--------------------- WordBag ---------------------*/
/*---------------------------------------------------*/

class WordBag {
    constructor(sequence) {
        this.increment = function(name) {
            if(!this.hasKey(name)) this.insert(name, 0);
            this.bag[name]++;
        }

        this.insert = function(name, count) {
            this.bag[name] = count;
        }

        this.hasKey = function(value){
            for(var key of this.keys()) {
                if(value == key) return true;
            }
            return false;
        }

        this.getCount = function(name) {
            return this.bag[name];
        }

        this.getBag = function() {
            return this.bag;
        }

        this.keys = function() {
            return Object.keys(this.bag);
        }

        this.printBag = function() {
            for(var key of this.keys()) {
                console.log(key + " : " + this.bag[key]);
            }
        }

        this.merge = function(bag) {
            for(var key of bag.keys()) {
                if(this.hasKey(key)) {
                    this.bag[key] = this.bag[key] + bag.bag[key];
                }
                else {
                    this.insert(key, bag.bag[key]);
                }
            }
        }

        this.bag = {};
        if(sequence !== undefined){
            for(var i = 0; i < sequence.length; i++) {
                this.increment(sequence[i]);
            }
            this.printBag();
        }

    }
}
/*--------------------------------------------------*/
/*--------------------- PTNode ---------------------*/
/*--------------------------------------------------*/

class PTNode {
    constructor(value){
        this.value = value;
        this.final = false;
        this.children = {};
    }
}

/*------------------------------------------------------*/
/*--------------------- PrefixTree ---------------------*/
/*------------------------------------------------------*/

class PrefixTree {
    constructor(trieObject) {
        if(trieObject === undefined) {
            this.head = new PTNode(null);
        }

        else {
            this.head = trieObject.head;
        }

        this.newNodeChild = function(node, childValue){
            node.children[childValue] = new PTNode(childValue);
        }

        this.nodeHasChild = function(node, value){
            var keys = Object.keys(node.children);
            for(var key of keys) {
                if(value == key) {
                    return true;
                }
            }
            return false;
        }

        this.nodeHasChildren = function(node){
            return Object.keys(node.children).length;
        }

        this.getNodeChildren = function(node){
            return Object.keys(node.children);
        }

        this.getNodeChild = function(node, value){
            return node.children[value];
        }

        this.finalizeNodeChild = function(node, value){
            node.children[value].final = true;
        }

        this.printAll = function(tree){
            var printHelper = function(tree, nav, word){
                if(nav.final){
                    console.log(word+nav.value);
                }
                var keys = Object.keys(nav.children);
                for(var key of keys){
                    printHelper(nav.children[key], word+(nav.value == null?'':nav.value));
                }
            }
            for (var child of this.getNodeChildren(this.head)) {
                printHelper(this, child, '')
            }
        }

        this.insert = function(wordInput){
            var insertHelper = function(tree, nav, word){
                if(!tree.nodeHasChild(nav, word[0])) {
                    tree.newNodeChild(nav, word[0]);
                }
                var popWord = word.slice(1);
                if(popWord.length == 0) {
                    tree.finalizeNodeChild(nav, word[0])
                }
                else {
                    insertHelper(tree, tree.getNodeChild(nav, word[0]), popWord);
                }
            }
            insertHelper(this, this.head, wordInput);
        }

        this.search = function(word, maxLength){
            var nav = this.head;
            var src = word;
            var results = [];
            var searchHelper = function(tree, nav, word){
                if (maxLength == results.length){
                    return;
                }
                if(nav.final){
                    results = results.concat(word+nav.value);
                }
                if(!tree.nodeHasChildren(nav)){
                    return;
                }
                for(var key of tree.getNodeChildren(nav)){
                    searchHelper(tree, nav.children[key], word+(nav.value == null?'':nav.value));
                }
            }

            if(word == ''){
                searchHelper(this, nav, '');
            }
            else{
                while(src.length > 1){
                    if(this.nodeHasChild(nav, src[0])){
                        nav = nav.children[src[0]];
                        src = src.slice(1);
                    }
                    else break;
                }
                if(!this.nodeHasChild(nav, src[0])){
                    return 'empty';
                }
                searchHelper(this, nav.children[src[0]], word.slice(0, word.length-1));
            }

            return results;
        }
    }
}

/*****************************************************************
                        IMPORTANT FUNCTIONS
*****************************************************************/

const createSequence = function(source) {
    var sequence = ['\n'];
    var lines = source.split("\n");
    for(var i = 0; i < lines.length; i++) {
        var text = lines[i].split(" ");
        var len = text.length;
        for (var j = 0; j < len; j++){
            sequence = sequence.concat([text[j]]);
        }
    }
    return sequence;
}

const mergeSequences = function(destination, source) {
    var result = [].concat(destination).concat(source);
    return result;
}

const cleanText = function(input) {
    var result = input.toLowerCase();

    var puncRegex = /[.\,!@#\$\%\^&\*\(\)/\\\?;:'"\[\]\{\}\|\-_=+`~]/g;
    result = result.replace(puncRegex, " ");

    var extraSpaceRegex = /[ ]+/g;
    result = result.replace(extraSpaceRegex, " ");

    return result.trim();
}
