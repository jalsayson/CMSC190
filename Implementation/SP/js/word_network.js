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


class NetworkNode {
    constructor(word) {
        this.word = word;
        this.end = 0;
        this.children = {};
        this.count = 0;
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

    getCount(){
        return this.count;
    }

    increment(){
        this.count++;
    }
}

/*
class WordNetwork {
    constructor(){
        this.head = new NetworkNode(null);
    }

    cleanText(input){
        //not properly working
        var copy = input;
        var regex1 = /[^\w\s]/g;
        var regex2 = /[\n]/g;
        // var regex2 = /\s{2,}/g;
        var replaced = copy.replace(regex1, "").replace(regex2, "\\n");
        var lines = replaced.toLowerCase().split("\n");
        return lines;
    }

    insert(sequence){
        var insert_helper = function(nav, sequence){
            if(!nav.hasChild(sequence[0])){
                //insert node
                nav.children[sequence[0]] = new NetworkNode(sequence[0]);
            }
            console.log(sequence.slice(1));
            if(sequence.slice(1).length == 0) nav.children[sequence[0]].end = 1;
            if(sequence.slice(1).length != 0) insert_helper(nav.children[sequence[0]], sequence.slice(1));
        }
        insert_helper(this.head, sequence);
    }

    print(){
        var print_helper = function(nav, word){
            if(nav.word != null) console.log(word+" "+nav.word);
            for(var key of nav.getChildren()){
                print_helper(nav.children[key], (nav.word != null?word+" "+nav.word:word));
            }
        }
        print_helper(this.head, "");
    }
}
*/

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
                console.log(this.matrix[key][key2]);
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
var string = "The Dursleys had everything they wanted, but they also had a secret, and their greatest fear was that somebody would discover it. They didn't think they could bear it if anyone found out about the Potters. Mrs. Potter was Mrs. Dursley's sister, but they hadn't met for several years; in fact, Mrs. Dursley pretended she didn't have a sister, because her sister and her good-for-nothing husband were as unDursleyish as it was possible to be. The Dursleys shuddered to think what the neighbors would say if the Potters arrived in the street. The Dursleys knew that the Potters had a small son, too, but they had never even seen him. This boy was another good reason for keeping the Potters away; they didn't want Dudley mixing with a child like that. When Mr. and Mrs. Dursley woke up on the dull, gray Tuesday our story starts, there was nothing about the cloudy sky outside to suggest that strange and mysterious things would soon be happening all over the country. Mr. Dursley hummed as he picked out his most boring tie for work, and Mrs. Dursley gossiped away happily as she wrestled a screaming Dudley into his high chair. None of them noticed a large, tawny owl flutter past the window. At half past eight, Mr. Dursley picked up his briefcase, pecked Mrs. Dursley on the cheek, and tried to kiss Dudley good-bye but missed, because Dudley was now having a tantrum and throwing his cereal at the walls. 'Little tyke,' chortled Mr. Dursley as he left the house. He got into his car and backed out of number four's drive. It was on the corner of the street that he noticed the first sign of something peculiar -- a cat reading a map. For a second, Mr. Dursley didn't realize what he had seen -- then he jerked his head around to look again. There was a tabby cat standing on the corner of Privet Drive, but there wasn't a map in sight. What could he have been thinking of? It must have been a trick of the light. Mr. Dursley blinked and stared at the cat. It stared back. As Mr. Dursley drove around the corner and up the road, he watched the cat in his mirror. It was now reading the sign that said Privet Drive -- no, looking at the sign; cats couldn't read maps or signs. Mr. Dursley gave himself a little shake and put the cat out of his mind. As he drove toward town he thought of nothing except a large order of drills he was hoping to get that day.";

var seq = createSequence(string);
var bag = new WordBag(seq);
// console.log(seq);
var pdm = new PredictionMatrix(bag, seq);
// pdm.printMatrix();
console.log(pdm.getTopRanks("he", 10));
