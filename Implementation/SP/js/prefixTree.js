class PTNode {
    constructor(value){
        this.value = value;
        this.final = false;
        this.children = {};
    }

    newChild(childValue){
        this.children[childValue] = new PTNode(childValue);
    }

    hasChild(value){
        var keys = Object.keys(this.children);
        for(var key of keys) {
            if(value == key) {
                return true;
            }
        }
        return false;
    }

    hasChildren(){
        return Object.keys(this.children).length;
    }

    getChildren(){
        return Object.keys(this.children);
    }

    getChild(value){
        return this.children[value];
    }

    finalizeChild(value){
        this.children[value].final = true;
    }
}

class PrefixTree{
    constructor(){
        this.head = new PTNode(null);
    }

    insert(word){
        var insertHelper = function(nav, word){
            if(!nav.hasChild(word[0])){
                nav.newChild(word[0]);
            }
            var popWord = word.slice(1);
            if(popWord.length == 0) {
                nav.finalizeChild(word[0]);
            }
            else{
                insertHelper(nav.getChild(word[0]), popWord);
            }
        }
        console.log(this);
        insertHelper(this.head, word);
    }

    printAll(){
        var printHelper = function(nav, word){
            if(nav.final){
                console.log(word+nav.value);
            }
            var keys = nav.getChildren();
            for(var key of keys){
                printHelper(nav.children[key], word+(nav.value == null?'':nav.value));
            }
        }
        printHelper(this.head, '');
    }

    search(word, maxLength){
        var nav = this.head;
        var src = word;
        var results = [];
        var searchHelper = function(nav, word){
            console.log(word+':'+nav.value);
            if (maxLength == results.length){
                return;
            }
            if(nav.final){
                results = results.concat(word+nav.value);
            }
            if(!nav.hasChildren()){
                return;
            }
            for(var key of nav.getChildren()){
                searchHelper(nav.children[key], word+(nav.value == null?'':nav.value));
            }
        }

        console.log(src);

        if(word == ''){
            searchHelper(nav, '', results);
        }
        else{
            while(src.length > 1){
                if(nav.hasChild(src[0])){
                    nav = nav.children[src[0]];
                    src = src.slice(1);
                }
                else break;
            }
            if(!nav.hasChild(src[0])){
                return 'empty';
            }
            searchHelper(nav.children[src[0]], word.slice(0, word.length-1), results);
        }

        return results;
    }
}

var p = new PrefixTree();
p.insert("hit")
p.printAll()


/*
prefixTree required functions:
- insert(word) : inserts word in prefix three
- search(word, maxLength) : search possible results given a word, end when maxLength is reached
- printAll() : displays all words from prefix tree

functions to consider:
- method for saving tree for local storage
- method for loading tree from local storage
*/
