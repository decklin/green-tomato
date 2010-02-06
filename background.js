config.defaults({
    timerLength: 25 * 60 * 1000,
    breakLength: 5 * 60 * 1000,
    blacklist: [],
});

var counting = false;
var blinking = false;
var blinkDelay = 500;
var blinkBadge = false;
var curIcon = 0;

var defaultIcon = 'icons/default.png';
var breakIcon = 'icons/break.png';
var timerIcons = [
    'icons/00.png',
    'icons/10.png',
    'icons/20.png',
    'icons/30.png',
    'icons/40.png',
    'icons/50.png',
    'icons/60.png',
    'icons/70.png',
    'icons/80.png',
    'icons/90.png'
];

chrome.browserAction.onClicked.addListener(function(tab) {
    if (!counting && !blinking) {
        // start
        counting = true;
        curIcon = 0;
        setIcon();
    } else if (counting) {
        // cancel
        counting = false;
        setIcon();
    } else if (blinking) {
        // break
        blinking = false;
        counting = false;
        chrome.browserAction.setBadgeText({text: ''});
        chrome.browserAction.setIcon({path: breakIcon});
        setTimeout(setIcon, config.get('breakLength'));
    }
});

function setIcon() {
    if (counting) {
        if (curIcon == timerIcons.length) {
            counting = false;
            blinking = true;
            blinkText();
        } else {
            chrome.browserAction.setIcon({path: timerIcons[curIcon++]});
            setTimeout(setIcon, config.get('timerLength') / timerIcons.length);
        }
    } else {
        chrome.browserAction.setIcon({path: defaultIcon});
    }
}

function blinkText() {
    if (blinking) {
        blinkBadge = !blinkBadge;
        chrome.browserAction.setBadgeText({text: blinkBadge ? '!!!' : ''});
        setTimeout(blinkText, blinkDelay);
    }
}

function isBlacklisted(url) {
    return config.get('blacklist').some(function(pat) {
        return RegExp(pat).test(url);
    });
}

chrome.extension.onRequest.addListener(function(msg, src, send) {
    send(counting && isBlacklisted(msg.url))
});
