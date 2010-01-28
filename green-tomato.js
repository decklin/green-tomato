chrome.extension.sendRequest({url: location.href}, function(blocked) {
    if (blocked) {
        location.href = chrome.extension.getURL('blocked.html');
    }
});
