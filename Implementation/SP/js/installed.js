/*****************************************************************
                            PAGE FUNCTIONS
*****************************************************************/
const initializeApplication = function() {
    //sets the values for the initial state of the predictor application
    var entry = document.getElementById("text-space").value;

    if(entry == "") {
        alert("No input found!");
        return;
    }

    //create 3/4 of the text representations (sequence, bag-of-words, and probability matrix)
    var entrySeq = createSequence(cleanText(entry));
    var entryBag = new WordBag(entrySeq);
    var entryMat = new PredictionMatrix(entryBag, entrySeq);

    chrome.storage.local.set(
        {
            matrix : entryMat,
            keywords : 6,
            initialized : true
        }
    );

    //creates the prefix tree separately as it already has words inside as of this point (see populatePrefix.js)
    chrome.storage.local.get(['prefixTree'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

        //feed every word that isn't whitespaace into the tree
        for(var word of entrySeq) {
            if(word != "\n" && word != " " && word != "") {
                tree.insert(word);
            }
        }

        //store the tree into local storage
        chrome.storage.local.set(
            {
                prefixTree : tree
            }
        );
    })

    alert("Thank you! The interface will now be loaded.")

    //move to main interface
    window.location.href = "../html/popup.html"
}

const on_run = function(){
    var src = document.getElementById("submit");
    submit.addEventListener('click', initializeApplication.bind(this));
}

on_run();
