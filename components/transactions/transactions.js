

Transactions = Backbone.Firebase.Collection.extend({
});

Ractive.components.transactions = Component.extend({
	adapt: ['Backbone'],
	template: "#transactions",
	data: {
		newTransaction: {},
		filter: function(transaction) {
			return transaction;
		}
	},
	init: function() {
		this._super();
		
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
					sum:t.sum,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				});
				this.set('newTransaction.sum', "");
				this.set('newTransaction.text', "");
			},
			'teardown': function() {
				this.userObserver.cancel();
				
				window.transactions = null;
			} 
		});
		
		window.transactions = this;
	}
});