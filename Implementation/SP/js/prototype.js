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
    var regex2 = /\s{2,}/g;
    var replaced = copy.replace(regex1, "").replace(regex2, "");
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
                // console.log(bag[text[j]])
            }
            bag[text[j]]++;
            // console.log(bag[text[j]])
        }
    }
    return bag;
}

const print_bag = function(bag){
    var keyset = Object.keys(bag)
    // console.log(keyset)
    for(var i = 0; i < keyset.length; i++){
        console.log(keyset[i] + " : " + bag[keyset[i]])
    }
}

const convert_to_chain = function(clean_text){
    var word_list = []
    // console.log(clean_text)
    for(var i = 0; i < clean_text.length; i++){
        var text = clean_text[i].split(" ");
        // console.log(text)
        word_list = word_list.concat(text);
    }
    // console.log(word_list)
    return word_list;
}

const occurence_count = function(matrix, chain){
    // console.log(chain)
    for (var i = 1; i < chain.length; i++){
        matrix[chain[i]][chain[i-1]]+=1;
    }
}

const divide_by_occurences = function(matrix, bag){
    // for(var key in Object.keys(matrix)){
    //     for(var key2 in Object.keys(matrix[key])){
    //         matrix[key][key2] = matrix[key][key2]/bag[key];
    //     }
    // }
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
        // console.log(converted_pair)
        ranking = ranking.concat([converted_pair])
    }
    ranking.sort(npp_compare);
    // console.log(ranking);
    //sort ranking
    return ranking;
}

// const main = function(){
    var original1 = "Hello world, I am Alvin and I will be making a text predictor application for Google Chrome.";
    var fs = require("fs")
    // var original = "derp twerk money";
    // fs.readFile("hp1.txt", 'utf8', function(err, data) {
    //     if (err) throw err;
    //     original = data;
    // });
    try {
        var original = fs.readFileSync('hp1.txt', 'utf8');
        console.log(original.toString());
    } catch(e) {
        console.log('Error:', e.stack);
    }

    var punc_free = clean_text(original)
    var split_bag = create_bag(punc_free)
    // print_bag(split_bag);

    var text_chain = convert_to_chain(punc_free)

    var probabilities = gen_prob_matrix(split_bag, text_chain)
    probabilities = divide_by_occurences(probabilities, split_bag)
    // print_prob_matrix(probabilities)

    var word = "harry";
    var rankings = 25;

    var rankers = get_top_rankers(word, rankings, probabilities, text_chain, split_bag);

    console.log("Top " + rankings + " Possible Words for " + word + ":");
    for(var i = 0; i != rankings.length && i < rankings; i++){
        console.log(rankers[i].name + " : " + rankers[i].value);
    }

    // console.log(punc_free);
    // var split_bag = create_bag(punc_free);

    // print_bag(split_bag);
// }
