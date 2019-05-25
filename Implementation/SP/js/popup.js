/*
DEVELOPMENT LINEUP:
    - option/settings page
*/

var start = 0;
var end = 0;
var prev = null;

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
        if(result.matrix !== undefined){
            var matrix = new PredictionMatrix(null, null, result.matrix);
            matrix.reference['bag'] = new WordBag(matrix.reference['sequence']);

            var results = matrix.getTopRanks(current, result.keywords*2)

            displayResults(current, results, 'matrix');
        }
    })
}

const getPrefixTreeResults = function(current) {
    chrome.storage.local.get(['prefixTree', 'keywords'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

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

const openSettings = function() {
    window.location.href = "../html/settings.html";
}

const on_run = function() {
    chrome.storage.local.get(['matrix'], function(result){
        if(result.matrix === undefined) {
            var wrap = document.getElementById("popup-wrap");
            wrap.style.display = "none";
            var div = document.createElement("div");
            div.style.width = "300px;"
            div.style.height = "400px;"
            div.style.padding = "8px;"
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

    var src3 = document.getElementById("settings-button");
    src3.addEventListener("click", openSettings);

    getMatrixResults("\n");
}

on_run();
