const minute = 60 * 1000;

function $(id) { return document.getElementById(id); }
function lines(s) { return s ? s.split('\n') : []; }

var timers = [
    'timerLength',
    'breakLength'
];

function init() {
    timers.forEach(function(k) {
        $(k).value = config.get(k) / minute;
    });

    $('blacklist').value = config.get('blacklist').join('\n');
}

function save() {
    timers.forEach(function(k) {
        config.set(k, $(k).value * minute);
    });

    config.set('blacklist', lines($('blacklist').value));
}
