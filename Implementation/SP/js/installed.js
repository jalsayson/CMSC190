/*****************************************************************
                            PAGE FUNCTIONS
*****************************************************************/

var pr={};

const initializeApplication = function() {
    var entry = document.getElementById("text-space").value;

    if(entry == "") {
        alert("No input found!");
        return;
    }

    var entrySeq = createSequence(cleanText(entry));
    var entryBag = new WordBag(entrySeq);
    var entryMat = new PredictionMatrix(entryBag, entrySeq);

    // chrome.tabs.executeScript({
    //     file : "output.js"
    // });

    chrome.storage.local.set(
        {
            matrix : entryMat,
            // prefixTree : enTrie,
            keywords : 6,
            initialized : true
        }
    );

    chrome.storage.local.get(['prefixTree'], function(result) {
        var tree = new PrefixTree(result.prefixTree);

        for(var word of entrySeq) {
            if(word != "\n" && word != " " && word != "") {
                tree.insert(word);
            }
        }

        chrome.storage.local.set(
            {
                prefixTree : tree
            }
        );
    })

    alert("Thank you! The interface will now be loaded.")

    window.location.href = "../html/popup.html"
}

const on_run = function(){
    var src = document.getElementById("submit");
    submit.addEventListener('click', initializeApplication.bind(this));
}

on_run();
