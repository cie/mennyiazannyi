

Transactions = Backbone.Firebase.Collection.extend({
});

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
				this.set('newTransaction.date', ""+new Date());
				this.set('newTransaction.from', "");
				this.set('newTransaction.to',   "");
				this.set('newTransaction.sum',  "");
				this.set('newTransaction.currency',  currencyChooser.data.currency);
				this.set('newTransaction.text', "");
				this.set('newTransaction.categories', "");
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