/*
DEVELOPMENT LINEUP:
    - regex fix
    - option/settings page
*/

var start = 0;
var end = 0;

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
                console.log(tree)
                console.log(nav)
                console.log(word)
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
            console.log(wordInput)
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
        for (var j = 0; j < text.length; j++){
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

    var puncRegex = /[\.\,!@#\$\%\^&\*\(\)/\\\?;:'"\[\]\{\}\|\-_=+`~]/g;
    result = result.replace(puncRegex, " ");
    console.log(result);

    return result;
}

/*****************************************************************
                            PAGE FUNCTIONS
*****************************************************************/

const addInput = function(word, current, type) {
    var textarea = document.getElementById("text-space");

    var beginning = textarea.value.substring(0, end);

    var middle = '';
    if(type == 'prefix') {
        middle =  word.substring(current.length, word.length);
    }

    else {
        middle = word;
    }

    var ending = " " + textarea.value.substring(end, textarea.value.length);

    end += word.length + 1;

    textarea.value = beginning + middle + ending;

    getMatrixResults(word);
}

const getMatrixResults = function(current) {
    chrome.storage.local.get(['matrix', 'keywords'], function(result) {
        var matrix = new PredictionMatrix(null, null, result.matrix);
        matrix.reference['bag'] = new WordBag(matrix.reference['sequence']);

        var results = matrix.getTopRanks(current, result.keywords*2)

        // console.log(results)

        displayResults(current, results, 'matrix');
    })
}

const getPrefixTreeResults = function(current) {
    chrome.storage.local.get(['prefixTree', 'keywords'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

        // console.log(tree);

        var results = new PrefixTree(result.prefixTree).search(current, result.keywords*2);

        displayResults(current, results, 'prefix');
    })
}

const createButton = function(current, option, type) {
    var div = document.createElement("div");
    div.className = "three column";
    div.innerHTML = option;
    div.addEventListener('click', addInput.bind(this, option, current, type));
    return div;
}

const getStart = function(string, end) {
    var start = end;
    do {
        //move cursor further back for spaces
        if(string[start] == " ") {
            start--;
            continue;
        }
        else {
            //add string to gathered inputs
            start--;
            //if entry is a space or past the first character
            if(string[start] == " " || string[start] === undefined) break;
            if(start < 0) break;
        }
    } while(true);

    return start;
}

const displayResults = function(current, results, type) {
    var container = document.getElementById("choices");
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    console.log(typeof results);

    if(typeof results == "object"){
        for(var i = 0; i < results.length/2; i++) {
            if(results[i] == "\n") {
                continue;
            }
            container.append(createButton(current, results[i], type));
        }
    }
    else {
        var span = document.createElement("span");
        span.className = "placeholder";
        span.innerHTML = "No results."
        container.append(span);
    }
}

const testCheck = function() {
    var entry = document.getElementById("text-space");
    end = entry.selectionStart;

    if(entry.value.length != 0 && end != 0) {
        start = getStart(entry.value, end);
    }

    var current = entry.value.substring(start, end).trim().toLowerCase();

    if(current == "") {
        var ministart = getStart(entry.value, end-1);
        current = entry.value.substring(ministart, end).trim();
        console.log("matrix")
        if(current == ""){
            getMatrixResults("\n");
        }
        else {
            getMatrixResults(current);
        }
    }

    else {
        console.log("prefix tree")
        getPrefixTreeResults(current);
    }
}

const copyText = function() {
    var text = document.getElementById("text-space");
    var entry = text.value;
    if(entry == "") {
        alert("No input to copy!");
        return;
    }

    var entrySeq = createSequence(cleanText(entry));
    var entryBag = new WordBag(entrySeq);
    var entryMat = new PredictionMatrix(entryBag, entrySeq);

    chrome.storage.local.get(['matrix'], function(result) {
        var matrix = new PredictionMatrix(null, null, result.matrix);
        matrix.reference['bag'] = new WordBag(matrix.reference['sequence']);

        matrix.merge(entryMat);

        chrome.storage.local.set(
            {
                matrix : matrix
            }
        );
    });

    chrome.storage.local.get(['prefixTree'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

        for(var word of entrySeq) {
            if(word != "\n") {          //consider regexing acceptable text
                tree.insert(word);
            }
        }

        chrome.storage.local.set(
            {
                prefixTree : tree
            }
        );
    });

    text.select();
    document.execCommand("copy");
}

const clearText = function() {
    var text = document.getElementById("text-space");
    text.value = "";
    start = 0;
    end = 0;
    getMatrixResults("\n");
}

const on_run = function() {
    chrome.storage.local.get(['matrix'], function(result){
        if(result.matrix === undefined) {
            var wrap = document.getElementById("popup-wrap");
            console.log(wrap);
            wrap.style.display = "none";
            var div = document.createElement("div");
            div.style.margin = "8px;"
            div.innerHTML = "Initialize your predictor!";

            var link = document.createElement("a");
            link.innerHTML = "Go here!";
            link.style.color = "blue";
            link.style.textDecoration = "underline";
            link.style.cursor = "pointer";
            link.href = "../html/installed.html";

            div.appendChild(document.createElement("br"));
            div.appendChild(link);
            document.body.appendChild(div);
        }
    });

    var src = document.getElementById("copy-button");
    src.addEventListener("click", copyText);

    var src = document.getElementById("clear-button");
    src.addEventListener("click", clearText);

    var src2 = document.getElementById("text-space");
    src2.addEventListener ("keyup", testCheck);
    src2.addEventListener ("click", testCheck);

    getMatrixResults("\n");
}

on_run();
