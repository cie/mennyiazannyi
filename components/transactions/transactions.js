Ractive.components.transactions = Component.extend({
	template: "#transactions",
	data: {
		newTransaction: {}
	},
	init: function() {
		this._super();
		
		page.observe("user", function(user, oldValue) {
			this.set("transactions", new Backbone.Firebase.Connection({
				firebase: users$.child(user.uid).child("transactions")
			}));
		});
		
		this.on({
			
			
			teardown: function() {
				window.transactions = null;
			} 
		});
		
		window.transactions = this;
	}
});