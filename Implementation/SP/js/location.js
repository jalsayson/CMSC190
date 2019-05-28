//stores the element where the text will be casted to
var clickLoc = null;

document.addEventListener("click", function(event) {
    //assigns a DOM element to clickLoc if the clicked element is a textarea or an input with type "text" or "search"
    var store = event.target;
    var storeTag = store.tagName.toLowerCase()
    if(storeTag == "textarea") {
        clickLoc = store;
    }
    else if(storeTag == "input") {
        if(store.getAttribute("type") == "text" || store.getAttribute("type") == "search") {
            clickLoc = store;
        }
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //communicates with the popup when the application wants to cast text to a textbox
    if(request.request == "getCastLocation") {
        clickLoc.value = request.text;
    }
})
