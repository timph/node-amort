'use strict';


var kraken = require('kraken-js'),
    app = {};


// Fired when an app configures itself
app.configure = function configure(nconf, next) {
    next(null);
};

// Fired at the beginning of an incoming request
app.requestStart = function requestStart(server) {
};

// Fired before routing occurs
app.requestBeforeRoute = function requestBeforeRoute(server) {
};

// Fired after routing occurs
app.requestAfterRoute = function requestAfterRoute(server) {
};


kraken.create(app).listen(function (err) {
    if (err) {
        console.error(err);
    }
});
