let on_install = function(){
    console.log("Extension is running!");
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
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

// chrome.webNavigation.onCompleted.addListener(on_input_detection);
chrome.runtime.onInstalled.addListener(on_install);
