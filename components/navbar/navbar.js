
Ractive.components.navbar = Component.extend({
	template: "#navbar",
	data: {
		pages: {
			transactions: {icon:"transfer"},
			budget: {icon:"briefcase"},
			flow: {icon:"stats"},
			love: {icon:"heart-empty"}
		},
		page: "transactions"
	},
	init: function() {
		this._super();
		window.navbar = this;
	}
});