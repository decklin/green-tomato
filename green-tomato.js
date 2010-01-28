chrome.extension.sendRequest({url: location.href}, function(blocked) {
    if (blocked) {
        document.documentElement.style.display = 'none';
    }
});
