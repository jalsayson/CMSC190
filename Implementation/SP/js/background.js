let on_install = function(){
    // //remove previous saved data, if any
    // chrome.storage.local.clear
    //
    // //put new data
    // chrome.storage.local.set({keywords : 3});
    // chrome.storage.local.set({})

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        // chrome.tabs.create({url: "../html/installed.html"}, function (tab) {});

        //enable extension if it detects a textbox in the website
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions : [
                new chrome.declarativeContent.PageStateMatcher({
                    css : [
                        "input[type='search']",
                    ]
                }),
            ],
            actions : [
                new chrome.declarativeContent.ShowPageAction(),
            ]
        }]);
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions : [
                new chrome.declarativeContent.PageStateMatcher({
                    css : [
                        "input[type='text']",
                    ]
                }),
            ],
            actions : [
                new chrome.declarativeContent.ShowPageAction(),
            ]
        }]);
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions : [
                new chrome.declarativeContent.PageStateMatcher({
                    css : [
                        "textarea",
                    ]
                }),
            ],
            actions : [
                new chrome.declarativeContent.ShowPageAction(),
            ]
        }]);
    });
};

/*
let on_input_detection = function(event){
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {file: "extender.js"});
        });
}
*/

chrome.runtime.onInstalled.addListener(on_install);
