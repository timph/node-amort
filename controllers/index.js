'use strict';

var querystring=require('querystring');

module.exports = function (server) {

    server.get('/', function (req, res) {
        //var model = { name: 'amortization' };
        //res.render('index', model);
        res.render('index');
    });

};
