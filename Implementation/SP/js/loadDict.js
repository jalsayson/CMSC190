var start = 0;
var end = 0;

/*****************************************************************
                               CLASSES
*****************************************************************/

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

var dictionary = []

var PrefixTree = new PrefixTree();