config.defaults({
    timerLength: 25 * 60 * 1000,
    breakLength: 5 * 60 * 1000,
    blacklist: [],
});

// If the timer is active, state will be an index into timerIcons. If not,
// it will be one of these negative constants.

const IDLE = -1;
const BLINK = -2;
const BREAK = -3;
var state = IDLE;

var blinkDelay = 500;
var blinkBadge = false;

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
    switch (state) {
    case IDLE:
        state = 0;
        setIcon();
        break;
    case BLINK:
        state = BREAK;
        chrome.browserAction.setBadgeText({text: ''});
        chrome.browserAction.setIcon({path: breakIcon});
        setTimeout(resetIcon, config.get('breakLength'));
        break;
    case BREAK:
    default:
        resetIcon();
        break;
    }
});

function setIcon() {
    if (state >= timerIcons.length) {
        state = BLINK;
        blinkText();
    } else if (state >= 0) {
        chrome.browserAction.setIcon({path: timerIcons[state++]});
        setTimeout(setIcon, config.get('timerLength') / timerIcons.length);
    } else {
        resetIcon();
    }
}

function resetIcon() {
    state = IDLE;
    chrome.browserAction.setIcon({path: defaultIcon});
}

function blinkText() {
    if (state == BLINK) {
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
    send(state >= 0 && isBlacklisted(msg.url))
});
