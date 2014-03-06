Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		this._super();
		
		auth = new FirebaseSimpleLogin(db$, function(error, user) {
			if (!error) {
				page.set("user", user);
			} else {	
				
			}
		});
		
		window.userAccount = this;
	}
});