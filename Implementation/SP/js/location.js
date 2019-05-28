var clickLoc = null;

document.addEventListener("click", function(event) {
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
    if(request.request == "getCastLocation") {
        clickLoc.value = request.text;
    }
})
