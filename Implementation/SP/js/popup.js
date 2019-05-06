/*
DEVELOPMENT LINEUP:
    - regex fix
    - connecting code to frontend
    - data saving to chrome storage
    - option/settings page
    - dynamic option count (determine max option)
*/

const wordbag = require('./wordBag');
const sequence = require('./sequence');
const predictionmatrix = require('./predictionMatrix');
const prefixTree = require('./prefixTree');

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

/*
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

    if(entry[entry.selectionStart-1] == " ") {
        //word-level

    }
    else{
        //letter-level

    }

    //now predict next word using current on a letter-level


}
*/

/*
const text_processing = function(){
    var entry = document.getElementById("text-space").value;
    var punc_free = clean_text(entry)
    var split_bag = create_bag(punc_free)
    var text_chain = convert_to_chain(punc_free)
    var probabilities = gen_prob_matrix(split_bag, text_chain)
    print_prob_matrix(probabilities)
}
*/

const create_button = function(option){
    var div = document.createElement("div");
    div.className = "three column";
    div.innerHTML = option;
    return div;
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

const on_run = function(){
    var src = document.getElementById("copy-button");
    // src.addEventListener("click", matrix_update);
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
