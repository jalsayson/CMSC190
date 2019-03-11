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

class PredictionMatrix {
    constructor(bag, sequence){
        this.matrix = {};
        this.reference = {
            'bag' : bag.getBag(),
            'sequence' : sequence,
            'keys' : bag.keys()
        };

        var keys = this.reference['keys'];
        for(var key1 of keys){
            this.matrix[key1] = {};
            for(var key2 of keys){
                this.matrix[key1][key2] = 0;
            }
        }

        // console.log(Object.keys(this.matrix));
        for(var i = 1; i < sequence.length; i++){
            this.matrix[sequence[i]][sequence[i-1]]++;
        }

        for(var key1 of keys){
            for(var key2 of keys){
                this.matrix[key1][key2] = this.matrix[key1][key2]/this.reference['bag'][key1];
            }
        }
    }

    printMatrix(){
        for(var key of Object.keys(this.matrix)){
            for(var key2 of Object.keys(this.matrix[key])){
                console.log(key + " given " + key2 + " : " + this.matrix[key][key2]);
            }
        }
    }

    getTopRanks(word, ranks = 3){
        var ranking = [];
        var npp_compare = function(a, b){
            if(a.value > b.value) return -1;
            if(a.value < b.value) return 1;
            return 0;
        }
        var keys = this.reference['keys'];
        for(var key of keys){
            var converted_pair = this.bayesComputation(word, key);
            ranking = ranking.concat(new NameProbabilityPair(key, converted_pair));
            ranking.sort(npp_compare);
            if(ranking.length > ranks) ranking = ranking.slice(0, ranks);
        }
        return ranking;
    }

    aGivenB(a,b){
        return this.matrix[a][b];
    }

    probOf(word){
        return this.reference['bag'][word]/this.reference['sequence'].length;
    }

    bayesComputation(word, key){
        if(this.probOf(key) == 0 || this.aGivenB(word, key) == 0) return 0;
        else return (this.aGivenB(word, key)*this.probOf(key))/this.probOf(word);
    }

}

class WordBag {
    constructor(sequence){
        this.bag = {};
        if(typeof sequence !== undefined){
            for(var i = 0; i < sequence.length; i++) {
                this.increment(sequence[i]);
            }
        }
    }

    hasKey(value){
        var keys = Object.keys(this.bag);
        for(var key of keys) {
            if(value == key) return true;
        }
        return false;
    }

    increment(name){
        if(!this.hasKey(name)) this.bag[name] = 0;
        this.bag[name]++;
    }

    insert(name, count){
        this.bag[name] = count;
    }

    getCount(name){
        return this.bag[name];
    }

    getBag(){
        return this.bag;
    }

    keys(){
        return Object.keys(this.bag);
    }

    printBag(){
        var keyset = Object.keys(this.bag);
        for(var i = 0; i < keyset.length; i++){
            console.log(keyset[i] + " : " + bag[keyset[i]])
        }
    }
}

const createSequence = function(source){
    var sequence = [];
    var lines = source.split("\n");
    for(var i = 0; i < lines.length; i++) {
        var text = lines[i].split(" ");
        for (var j = 0; j < text.length; j++){
            sequence = sequence.concat([text[j]]);
        }
    }
    return sequence;
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

const create_button = function(option){
    var div = document.createElement("div");
    div.className = "three column";
    div.innerHTML = option;]
    return div;
}

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

const on_run = function(){
    // var src = document.getElementById("copy-button");
    // src.addEventListener("click", text_processing);

    var src2 = document.getElementById("text-space");
    src2.addEventListener ("keyup", caret_sens_text_check);
    src2.addEventListener ("click", caret_sens_text_check);

    var src3 = document.getElementById("begin-button");
    src3.addEventListener("click", test_matrix);
}

// let current = "";
// let previous = 0;
on_run();
