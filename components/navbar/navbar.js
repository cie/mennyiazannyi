
Ractive.components.navbar = Component.extend({
	template: "#navbar",
	data: {
		tabs: {
			transactions: {icon:"transfer"},
			budget: {icon:"briefcase"},
			flow: {icon:"stats"},
			love: {icon:"heart-empty"}
		}
	},
	globals: ['tab'],
	init: function() {
		this._super();
		
		window.navbar = this;
	}
});