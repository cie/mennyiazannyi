

Transactions = Backbone.Firebase.Collection.extend({
});

MY_ACCOUNT = "Me";

/**
 * Tell if an account is owned by the user.
 */
myAccount = function(acctName) {
	acctName = acctName.toLowerCase();
	if (acctName == MY_ACCOUNT.toLowerCase()) return true;
	for (lang in TRANSLATIONS) {
		var translation = TRANSLATIONS[lang][MY_ACCOUNT];
		if (translation && translation.toLowerCase() === acctName) return true;
	}
	return false;
}

Ractive.components.transactions = Component.extend({
	adapt: ['Backbone'],
	template: "#transactions",
	data: {
		newTransaction: {
			date: new Date(),
			from: "",
			to: "",
			amount: {
				sum: 0,
				currency: "EUR"
			},
			text: "",
			categories: ""
		},
		filter: function(transaction) {
			return transaction;
		}
	},
	init: function() {
		if (this._super) this._super();
		
		this.userObserver = page.observe("user", function(user, oldValue) {
			if (user && user.uid) {
				this.data.transactions = new Transactions([], {
					firebase: users$.child(user.uid).child("transactions")
				});
			} else {
				this.data.transactions = [];
			}
			this.update();
			
		});
		
		var self = this;
		this.currencyObserver = currencyChooser.observe("currency", function(currency) {
			if (! self.get("newTransaction.sum")) {
				self.set("newTransaction.currency", currency);
			}
		});
		
		this.on({
			'moveDown': function(event, direction) {
				console.log(event);
			},
			'addTransaction': function() {
				var t = this.data.newTransaction;
				this.data.transactions.push({
					date:t.date,
					from:t.from,
					to:t.to,
					 // enable decimal comma, avoid NaNs
					sum: +(""+t.sum).replace(",", ".") || 0,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				});
				this.set('newTransaction.date', new Date().toDateString);
				if (!myAccount(t.from)) this.set('newTransaction.from', "");
				if (!myAccount(t.to))   this.set('newTransaction.to',   "");
				this.set('newTransaction.sum',  "");
				this.set('newTransaction.currency',  currencyChooser.data.currency);
				this.set('newTransaction.text', "");
				this.set('newTransaction.categories', "");
				
				// focus first item in new row
				$("table>tfoot>tr input",this.el).first().focus()
			},
			'teardown': function() {
				this.userObserver.cancel();
				this.currencyObserver.cancel();
				
				window.transactions = null;
			} 
		});
		
		window.transactions = this;
	}
});