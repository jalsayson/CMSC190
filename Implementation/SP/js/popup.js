class PTNode {
    constructor(value){
        this.value = value;
        this.final = 0;
        this.children = {};
    }

    hasChild(value){
        var keys = Object.keys(this.children);
        for(var key of keys) {
            if(value == key) return true;
        }
        return false;
    }

    hasChildren(){
        return Object.keys(this.children).length;
    }

    getChildren(){
        return Object.keys(this.children);
    }
}

class PrefixTree{
    constructor(){
        this.head = new PTNode(null);
    }

    insert(word){
        var insert_helper = function(nav, word){
            var keys = Object.keys(nav.children);
            var check = true;
            for(var key of keys){
                if(key == word[0]){
                    check = false;
                    break;
                }
            }
            if(check){
                //insert node
                nav.children[word[0]] = new PTNode(word[0]);
            }
            if(word.slice(1).length == 0) nav.children[word[0]].final = 1;
            if(word.slice(1).length != 0) insert_helper(nav.children[word[0]], word.slice(1));
        }
        insert_helper(this.head, word);
    }

    print_all(){
        var print_helper = function(nav, word){
            if(nav.final){
                console.log(word+nav.value);
            }
            var keys = Object.keys(nav.children);
            for(var key of keys){
                print_helper(nav.children[key], (nav.value != null?word+nav.value:word));
            }
        }
        print_helper(this.head, "");
    }

    word_search(term){
        var print_helper = function(nav, word){
            if(nav.final){
                // console.log(word+nav.value);
                results = results.concat(word+nav.value);
            }
            if(!nav.hasChildren()) return;
            for(var key of nav.getChildren()){
                print_helper(nav.children[key], (nav.value != null?word+nav.value:word));
            }
        }
        var nav = this.head;
        var src = term;
        var results = [];

        if(term == "") {
            print_helper(nav, "", results);
        }

        else{
            while(src.length > 1){
                if(nav.hasChild(src[0])){
                    nav = nav.children[src[0]];
                    src = src.slice(1);
                }
                else break;
            }
            if(!nav.hasChild(src[0])) return "empty";
            print_helper(nav.children[src[0]], term.slice(0,term.length-1), results);
        }

        return results;
    }

}

class NameProbabilityPair {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    compare(comp) {
        if(this.value > comp.value) {
            return this
        }
        return comp;
    }
}

const npp_compare = function(a, b){
    if(a.value > b.value) return -1;
    if(a.value < b.value) return 1;
    return 0;
}

const hasProperty = function(object, property){
    return Object.prototype.hasOwnProperty.call(object, property);
}

//source: https://toddmotto.com/methods-to-determine-if-an-object-has-a-given-property/

const clean_text = function(input){
    //not properly working
    var copy = input;
    var regex1 = /[^\w\s]/g;
    var regex2 = /[\n]/g;
    // var regex2 = /\s{2,}/g;
    var replaced = copy.replace(regex1, "").replace(regex2, "\\n");
    var lines = replaced.toLowerCase().split("\n");
    return lines;
}
//other regex: .,\/#!$%\^&\*;:{}=\-_`~()
//other regex src: https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex

const create_bag = function(input){
    var bag = {};
    var copy = input;

    for(var i = 0; i < input.length; i++) {
        text = input[i].split(" ");
        for (var j = 0; j < text.length; j++){
            if(!hasProperty(bag, text[j])){
                bag[text[j]] = 0;
            }
            bag[text[j]]++;
        }
    }
    return bag;
}

const print_bag = function(bag){
    var keyset = Object.keys(bag)
    for(var i = 0; i < keyset.length; i++){
        console.log(keyset[i] + " : " + bag[keyset[i]])
    }
}

const convert_to_chain = function(clean_text){
    var word_list = []
    for(var i = 0; i < clean_text.length; i++){
        var text = clean_text[i].split(" ");
        word_list = word_list.concat(text);
    }
    return word_list;
}

const occurence_count = function(matrix, chain){
    // console.log(chain)
    for (var i = 1; i < chain.length; i++){
        matrix[chain[i]][chain[i-1]]+=1;
    }
}

const divide_by_occurences = function(matrix, bag){
    var keyset = Object.keys(matrix);
    for(var i = 0; i < keyset.length; i++){
        for(var j = 0; j < keyset.length; j++){
            matrix[keyset[i]][keyset[j]] = matrix[keyset[i]][keyset[j]]/bag[keyset[i]];
        }
    }
    return matrix;
}

const gen_prob_matrix = function(bag, chain){
    var matrix = {}
    var keyset = Object.keys(bag);
    for(var i = 0; i < keyset.length; i++){
        matrix[keyset[i]] = {}
        for(var j = 0; j < keyset.length; j++){
            matrix[keyset[i]][keyset[j]] = 0;
        }
    }

    occurence_count(matrix, chain);
    matrix = divide_by_occurences(matrix, bag);

    return matrix;
}

const print_prob_matrix = function(matrix){
    var keyset = Object.keys(matrix);
    for(var i = 0; i < keyset.length; i++){
        for(var j = 0; j < keyset.length; j++){
            console.log(keyset[i] + " given " + keyset[j] + " = " + matrix[keyset[i]][keyset[j]]);
        }
    }
}

const get_top_rankers = function(word, slots, matrix, chain, bag){
    var ranking = []
    var p_word = bag[word]/text_chain.length;
    var keyset = Object.keys(matrix[word]);
    for(var i = 0; i < keyset.length; i++){
        var p_key2 = bag[keyset[i]]/text_chain.length;
        var p_word_key2 = matrix[keyset[i]][word];
        if(p_key2 == 0 || p_word_key2 == 0) continue;
        var converted_pair = new NameProbabilityPair(keyset[i], ((p_word_key2*p_key2)/p_word))
        ranking = ranking.concat([converted_pair])
    }
    ranking.sort(npp_compare);
    //sort ranking
    return ranking;
}

const initial_processing = function(){
    var entry = document.getElementById("text-space").value;
    var punc_free = clean_text(entry)
    var split_bag = create_bag(punc_free)
    var text_chain = convert_to_chain(punc_free)
    var probabilities = gen_prob_matrix(split_bag, text_chain)
    print_prob_matrix(probabilities)
}

const text_check = function(){
    var entry = document.getElementById("text-space").value;
    var token = entry.split(" ");
    console.log(clean_text(token[token.length-1]));
}

const caret_sens_text_check = function(){
    var entry = document.getElementById("text-space");
    var pos = entry.selectionStart-1;
    if(pos < 0) pos = 0;
    var current = "";

    if(entry.value.length != 0 && pos != 0){
        do{
            if(entry.value[pos] == " "){
                pos--;
                continue;
            }
            else{
                current += entry.value[pos];
                pos--;
                if(entry.value[pos] == " " || entry.value[pos] == undefined) break;
                if(pos < 0) break;
            }
        } while(true);
        current = current.split("").reverse().join("");
    }

    console.log(current);

    //now predict next word using current on a letter-level

}

const text_processing = function(){
    var entry = document.getElementById("text-space").value;
    var punc_free = clean_text(entry)
    var split_bag = create_bag(punc_free)
    var text_chain = convert_to_chain(punc_free)
    var probabilities = gen_prob_matrix(split_bag, text_chain)
    print_prob_matrix(probabilities)
}

const on_run = function(){
    // var src = document.getElementById("copy-button");
    // src.addEventListener("click", text_processing);

    var src2 = document.getElementById("text-space");
    src2.addEventListener ("keyup", caret_sens_text_check);
    src2.addEventListener ("click", caret_sens_text_check);

    var src3 = document.getElementById("begin-button");
    src3.addEventListener("click", initial_processing);
}

// let current = "";
// let previous = 0;
on_run();
