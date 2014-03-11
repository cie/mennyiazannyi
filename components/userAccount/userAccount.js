Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		if (this._super) this._super();
		
		this.auth = new FirebaseSimpleLogin(db$, function(error, user) {
			if (!error) {
				page.set("user", user);
			} else {	
				
			}
		});
		
		this.on({
			"login": function(event, provider) {
				this.auth.login(provider);
			},
			"logout": function(event, provider) {
				this.auth.logout();
			}
		});
		
		window.userAccount = this;
	}
});