//variables used in finding the point of reference when performing predictions
var start = 0;
var end = 0;
var prev = null;

/*****************************************************************
                            PAGE FUNCTIONS
*****************************************************************/

const addInput = function(word, current, type) {
    //adds a word to the textarea in the popup.
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
    //load results given an input in a word-level context
    chrome.storage.local.get(['matrix', 'keywords'], function(result) {
        if(result.matrix !== undefined){
            var matrix = new PredictionMatrix(null, null, result.matrix);
            matrix.reference['bag'] = new WordBag(matrix.reference['sequence']);

            var results = matrix.getTopRanks(current, result.keywords*2)

            displayResults(current, results, 'matrix');
        }
    })
}

const getPrefixTreeResults = function(current) {
    //load results given an input in a letter-level context
    chrome.storage.local.get(['prefixTree', 'keywords'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

        var results = new PrefixTree(result.prefixTree).search(current, result.keywords*2);

        displayResults(current, results, 'prefix');
    })
}

const createButton = function(current, option, type) {
    //factory function for word options in the popup
    var div = document.createElement("div");
    div.className = "three column";
    div.innerHTML = option;
    div.addEventListener('click', addInput.bind(this, option, current, type));
    return div;
}

const getStart = function(string, end) {
    //get the start of the word to be used in getting inputs
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
    //place buttons as options in the popup
    var container = document.getElementById("choices");
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if(typeof results == "object"){
        for(var i = 0; i < results.length/2; i++) {
            if(results[i] == "\n" || results[i] == "") {
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
    //dynamic loading of options depending on what the user is currently typing on the text box
    var entry = document.getElementById("text-space");
    end = entry.selectionStart;

    if(entry.value.length != 0 && end != 0) {
        start = getStart(entry.value, end);
    }

    var current = entry.value.substring(start, end).trim().toLowerCase();

    if(current == "") {
        var ministart = getStart(entry.value, end-1);
        current = entry.value.substring(ministart, end).trim();
        if(current == "") {
            getMatrixResults("\n");
        }
        else {
            getMatrixResults(current);
        }
    }

    else {
        getPrefixTreeResults(current);
    }
}

const updateNetwork = function() {
    //update the four representations given the input in the text box
    var text = document.getElementById("text-space");
    var entry = text.value;
    if(entry == "") {
        alert("No input to process!");
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
}

const copyText = function() {
    updateNetwork();

    var text = document.getElementById("text-space");
    text.select();
    document.execCommand("copy");
}

const castToTextbox = function() {
    updateNetwork();

    //casts the input in the text box to the DOM element stored in clickLoc in location.js, if any
    var text = document.getElementById("text-space").value;
    chrome.tabs.query({
        active : true,
        currentWindow : true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            request : "getCastLocation",
            text : text
        }, function(response) {
            console.log("yet");
        });
    })
}

const clearText = function() {
    var text = document.getElementById("text-space");
    text.value = "";
    start = 0;
    end = 0;
    getMatrixResults("\n");
}

const openSettings = function() {
    window.location.href = "../html/settings.html";
}

const on_run = function() {
    //checks first if the predictor's initial state has been created, as well as binds the functions to the buttons

    chrome.storage.local.get(['initialized'], function(result){
        if(result.initialized === undefined) {
            var wrap = document.getElementById("popup-wrap");
            wrap.style.display = "none";

            window.location.href = "../html/installed.html";
        }
    });

    var src = document.getElementById("copy-button");
    src.addEventListener("click", copyText);

    var src2 = document.getElementById("update-button");
    src2.addEventListener("click", updateNetwork);

    var src3 = document.getElementById("cast-button");
    src3.addEventListener("click", castToTextbox);

    var src4 = document.getElementById("clear-button");
    src4.addEventListener("click", clearText);

    var src5 = document.getElementById("text-space");
    src5.addEventListener ("keyup", testCheck);
    src5.addEventListener ("click", testCheck);

    var src6 = document.getElementById("settings-button");
    src6.addEventListener("click", openSettings);

    //get first results
    getMatrixResults("\n");
}

on_run();
