let on_install = function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        //enable extension if it detects a textarea or an input with type "text" or "search" in the website
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

chrome.runtime.onInstalled.addListener(on_install);
