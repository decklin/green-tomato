function $(id) { return document.getElementById(id); }
function lines(s) { return s ? s.split('\n') : []; }

var timers = [
    'timerLength',
    'breakLength'
];

function init() {
    timers.forEach(function(k) {
        $(k).value = config.get(k) / (60 * 1000);
    });
    $('blacklist').value = config.get('blacklist').join('\n');
}

function save() {
    timers.forEach(function(k) {
        config.set(k, $(k).value * 60 * 1000);
    });
    config.set('blacklist', lines($('blacklist').value));
}
