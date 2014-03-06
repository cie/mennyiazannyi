Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		auth = new FirebaseSimpleLogin(db$, function(error, user) {
			if (!error) {
				page.set("user", user);
			} else {	
				
			}
		});
	}
});