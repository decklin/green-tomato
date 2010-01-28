var timers = [
    'timerLength',
    'breakLength'
];

function init() {
    timers.forEach(function(k) {
        document.getElementById(k).value = config.get(k) / (60 * 1000);
    });
}

function save() {
    timers.forEach(function(k) {
        config.set(k, document.getElementById(k).value * 60 * 1000);
    });
}
