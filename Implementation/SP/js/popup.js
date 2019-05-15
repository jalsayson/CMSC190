/*
DEVELOPMENT LINEUP:
    - regex fix
    - connecting code to frontend
    - data saving to chrome storage
    - option/settings page
    - dynamic option count (determine max option)
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
            this.reference['sequence'] = mergeSequences(this.reference['sequence'], pm2.reference['sequence']);
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
    var result = input;
    return result;
}

/*****************************************************************
                            PAGE FUNCTIONS
*****************************************************************/

/*
const initial_processing = function(){
    var entry = document.getElementById("text-space").value;
    var punc_free = clean_text(entry)
    var split_bag = create_bag(punc_free)
    var text_chain = convert_to_chain(punc_free)
    var probabilities = gen_prob_matrix(split_bag, text_chain)
    print_prob_matrix(probabilities)
}
*/

/*
const text_check = function(){
    var entry = document.getElementById("text-space").value;
    var token = entry.split(" ");
    console.log(clean_text(token[token.length-1]));
}
*/

const createButton = function(option) {
    var div = document.createElement("div");
    div.className = "three column";
    div.innerHTML = option;
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

const displayResults = function(results) {
    var container = document.getElementById("choices");
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(var i = 0; i < results.length; i++) {
        container.append(createButton(results[i]));
    }
}

const testCheck = function() {
    var entry = document.getElementById("text-space");
    // var pos = entry.selectionStart-1;
    end = entry.selectionStart;
    // var current = "";
    //
    // if(entry.value.length > 0 && start != 0){
    //     start = end;
    //     do {
    //         start--;
    //     }
    //     while(entry.value[start] != " " || start != 0)
    // }

    if(entry.value.length != 0 && end != 0) {
        start = getStart(entry.value, end);
    }

    var current = entry.value.substring(start, end).trim();

    if(current == "") {
        var ministart = getStart(entry.value, end-1);
        current = entry.value.substring(ministart, end).trim();
        console.log("matrix")
        chrome.storage.local.get(['matrix', 'keywords'], function(result) {
            var matrix = new PredictionMatrix(null, null, result.matrix);
            matrix.reference['bag'] = new WordBag(matrix.reference['sequence']);

            var results = matrix.getTopRanks(current, result.keywords)

            // console.log(results)

            displayResults(results)
        })
    }

    else {
        console.log("prefix tree")
        chrome.storage.local.get(['prefixTree', 'keywords'], function(result) {
            var tree = new PrefixTree(result.prefixTree);

            // console.log(tree);

            var results = new PrefixTree(result.prefixTree).search(current, result.keywords);

            // console.log(results);

            displayResults(results);
        })
    }
}

/*
const test_matrix = function(){
    var string = document.getElementById('text-space').value;
    var seq = createSequence(string);
    var bag = new WordBag(seq);
    // console.log(seq);
    var pdm = new PredictionMatrix(bag, seq);
    // pdm.printMatrix();
    var rankers = pdm.getTopRanks("i", 10);
    // var insert = [];
    var cont = document.getElementById('choices');
    while (cont.firstChild) {
        cont.removeChild(cont.firstChild);
    }
    for(var i = 0; i < 10; i++){
        cont.appendChild(create_button(rankers[i].name));
    }
}
*/

/*
const matrix_update = function(){
    var entry = document.getElementById("text-space").value;
    var seq = createSequence(string);
    var bag = new WordBag(seq);

    chrome.storage.local.get(['matrix'], function(result){
        if(result.matrix === undefined){
            var pdm = new PredictionMatrix(bag, seq);
        }
        else{
            pdm.updateMatrix(bag, seq);
        }
    })
}
*/

const move = function(link) {
    chrome.tabs.create({url: link}, function (tab) {});
}

const on_run = function() {
    chrome.storage.local.get(['matrix'], function(result){
        if(result.matrix === undefined) {
            var wrap = document.getElementById("popup-wrap");
            console.log(wrap);
            wrap.style.display = "none";
            var div = document.createElement("div");
            div.innerHTML = "Initialize your predictor!";

            var link = document.createElement("a");
            link.innerHTML = "Go here!";
            link.style.color = "blue";
            link.style.textDecoration = "underline";
            link.style.cursor = "pointer";
            link.href = "../html/installed.html";

            // link.addEventListener('click', move.bind(this, "../html/installed.html"));

            div.appendChild(document.createElement("br"));
            div.appendChild(link);
            document.body.appendChild(div);
        }
    });

    var src = document.getElementById("copy-button");
    // src.addEventListener("click", matrix_update);
    // src.addEventListener("click", text_processing);

    var src2 = document.getElementById("text-space");
    src2.addEventListener ("keyup", testCheck);
    src2.addEventListener ("click", testCheck);

    var src3 = document.getElementById("begin-button");
    // src3.addEventListener("click", test_matrix);
}

on_run();
