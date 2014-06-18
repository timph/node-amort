'use strict';

function Loan(amt, apr, term) {
	this.amount = amt;
	this.apr = apr;
	this.term = term;
};

module.exports=Loan
