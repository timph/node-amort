'use strict';

/**
 * User: Tim Pham
 * Date: 12/6/13
 *
 Exercise Details:
 Build an amortization schedule program using Java. 
  
 The program should prompt the user for
 the amount he or she is borrowing,
 the annual percentage rate used to repay the loan,
 the term, in years, over which the loan is repaid.  
  
 The output should include:
 The first column identifies the payment number.
 The second column contains the amount of the payment.
 The third column shows the amount paid to interest.
 The fourth column has the current balance.  The total payment amount and the interest paid fields.
  
 Use appropriate variable names and comments.  You choose how to display the output (i.e. Web, console).  
 Amortization Formula
 This will get you your monthly payment.  Will need to update to Java.
 M = P * (J / (1 - (Math.pow(1/(1 + J), N))));
  
 Where:
 P = Principal
 I = Interest
 J = Monthly Interest in decimal form:  I / (12 * 100)
 N = Number of months of loan
 M = Monthly Payment Amount
  
 To create the amortization table, create a loop in your program and follow these steps:
 1.      Calculate H = P x J, this is your current monthly interest
 2.      Calculate C = M - H, this is your monthly payment minus your monthly interest, so it is the amount of principal you pay for that month
 3.      Calculate Q = P - C, this is the new balance of your principal of your loan.
 4.      Set P equal to Q and go back to Step 1: You thusly loop around until the value Q (and hence P) goes to zero.
 */

/*
    Class Amortization to contain values for each line of the month
*/
function Amortization(pnum, pamt, minterest, curbal, totalpay, totalinterest) {
	this.payNumber = pnum;
	this.payment = pamt;
	this.paymentInterest = minterest;
	this.currentBalance = curbal;
	this.totalPayments = totalpay;
	this.totalInterestPaid = totalinterest;
};

/*
 Class Scheduler to take in constructor params
 @param loan Loan object with amount, apr, term
 @param amorts array of Amortization objects

*/
function Scheduler(loan, amorts) {
	this.MONTHLY_INTEREST_DIVISOR = 12 * 100;

	console.log(loan);
	if ((0.01 <= loan.amount && loan.amount <= 1000000000000) &&
		(0.000001 <= loan.apr && loan.apr <= 100) &&
		(1 <= loan.term && loan.term <= 1000000)) {
			// good value	
		} else {
			console.error('Loan input is invalid');
			throw 'Loan input is invalid';
	}

	this.amountBorrowed = Math.round(loan.amount * 100); // in cents
	this.apr = loan.apr;
	this.termMonths = loan.term * 12;
    // calculate J
    this.monthlyInterest = this.apr / this.MONTHLY_INTEREST_DIVISOR;
	this.monthlyPayment = calcMonthlyPayment(this.monthlyInterest, this.termMonths, this.amountBorrowed); // in cents

	// the following shouldn't happen with the available valid ranges
	// for borrow amount, apr, and term; however, without range validation,
	// monthlyPaymentAmount as calculated by calculateMonthlyPayment()
	// may yield incorrect values with extreme input values
	if (this.monthlyPayment > this.amountBorrowed) {
		throw 'Extreme value input exception';
	}

  /*
   method of Scheduler to calculate monthly payment
  */
  function calcMonthlyPayment(monthlyInterest, termMonths, amountBorrowed) {
    // M = P * (J / (1 - (Math.pow(1/(1 + J), N))));
    //
    // Where:
    // P = Principal
    // I = Interest
    // J = Monthly Interest in decimal form:  I / (12 * 100)
    // N = Number of months of loan
    // M = Monthly Payment Amount
    // 

    // this is 1 / (1 + J)
    var tmp = Math.pow(1 + monthlyInterest, -1);

    // this is Math.pow(1/(1 + J), N)
    tmp = Math.pow(tmp, termMonths);

    // this is 1 / (1 - (Math.pow(1/(1 + J), N))))
    tmp = Math.pow(1 - tmp, -1);

    // M = P * (J / (1 - (Math.pow(1/(1 + J), N))));
    var rc = amountBorrowed * monthlyInterest * tmp;

	return Math.round(rc);
  } // end of calcMonthlyPayment()

} // end of class Scheduler

/*
 Add new method schedule() to Schedule monthly amortization based on Loan input
  The result is pushed into array of Amortization, provided by amorts
*/
Scheduler.prototype.schedule = function(amorts) {

	var balance = this.amountBorrowed;
	var totalPayments = 0;
	var totalInterestPaid = 0;
	var paymentNumber = 1;
	var maxNumberOfPayments = this.termMonths;

	while ((balance > 0) && (paymentNumber <= maxNumberOfPayments)) {

		var curMonthlyInterest = Math.round(balance * this.monthlyInterest);

        // the amount required to payoff the loan
		var curPayoffAmount = balance + curMonthlyInterest;

		// the amount to payoff the remaining balance may be less than the calculated monthlyPaymentAmount
		var curMonthlyPaymentAmount = Math.min(this.monthlyPayment, curPayoffAmount);

		// it's possible that the calculated monthlyPaymentAmount is 0,
		// or the monthly payment only covers the interest payment - i.e. no principal
		// so the last payment needs to payoff the loan
		if ((paymentNumber === maxNumberOfPayments) &&
			((curMonthlyPaymentAmount === 0) || (curMonthlyPaymentAmount === curMonthlyInterest))) {
			curMonthlyPaymentAmount = curPayoffAmount;
		}

        // Calculate C = M - H, this is your monthly payment minus your monthly interest,
		// so it is the amount of principal you pay for that month
		var curMonthlyPrincipalPaid = curMonthlyPaymentAmount - curMonthlyInterest;

		// Calculate Q = P - C, this is the new balance of your principal of your loan.
		var curBalance = balance - curMonthlyPrincipalPaid;

		totalPayments += curMonthlyPaymentAmount;
		totalInterestPaid += curMonthlyInterest;

		// output is in dollars
		amorts.push(new Amortization(paymentNumber++, curMonthlyPaymentAmount / 100, curMonthlyInterest / 100, curBalance / 100, totalPayments / 100, totalInterestPaid / 100));
		// Set P equal to Q and go back to Step 1: You thusly loop around until the value Q (and hence P) goes to zero.
		balance = curBalance;
	}

	return amorts;
};

// exports Scheduler class
module.exports=Scheduler;
