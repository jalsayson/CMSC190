const updateDisplay = function() {
    //changes the number in the keywords option
    var span = document.getElementById("count");
    var rangeSrc = document.getElementById("keyrange");

    span.innerHTML = rangeSrc.value;

    chrome.storage.local.set({
        'keywords' : rangeSrc.value
    })
}

const backToMain = function() {
    window.location.href = "../html/popup.html";
}

const confirmDelete = function() {
    //resets extension state without uninstalling and reinstalling the extension
    var del = confirm("Are you sure you would like to reset the application?");
    if(del) {
        chrome.storage.local.remove('matrix');
        chrome.storage.local.remove('prefixTree');
        chrome.storage.local.remove('keywords');
        chrome.storage.local.remove('initialized');
        backToMain();
    }
}

const on_run = function() {
    var rangeSrc = document.getElementById("keyrange");
    var resetBtn = document.getElementById("reset-button");
    var backBtn = document.getElementById("settings-footer");

    chrome.storage.local.get(['keywords'], function(result) {
        rangeSrc.value = result.keywords;
        updateDisplay();
    })

    rangeSrc.addEventListener('change', updateDisplay.bind(this));
    resetBtn.addEventListener('click', confirmDelete.bind(this));
    backBtn.addEventListener('click', backToMain.bind(this));
}

on_run();
