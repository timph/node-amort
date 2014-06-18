'use strict';

var url=require('url');
var querystring=require('querystring');
var Scheduler=require('../lib/scheduler');
var Loan=require('../models/loan');

module.exports = function (server) {

    server.post('/amortization', function (req, res) {
	 /* for GET call
		var reqUrl = url.parse(req.url);
		var query = reqUrl.query;
		var queryArr = querystring.parse(query);
		var amt = queryArr['amount'];
		var apr = queryArr['apr'];
		var term = queryArr['loanTerm'];
	 */

		var body = '';
		req.on('data', function (data) {
			body += data;
		});

		req.on('end', function () {

			var postdata = querystring.parse(body);
			// use POST
			var amt = postdata.amount;
			var apr = postdata.apr;
			var term = postdata.loanTerm;

			var loan = new Loan(amt, apr, term);

			console.log('Loan: amount='+loan.amount+' apr='+loan.apr+' term='+loan.term);

			var amorts = [];
			var scheduler = new Scheduler(loan);
			scheduler.schedule(amorts);
			console.log(amorts);
			var model = { loan: loan, amorts : amorts };
			res.render('amortization', model);
		  }); // end POST
    });

};
