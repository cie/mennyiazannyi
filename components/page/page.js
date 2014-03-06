
Ractive.components.page = Component.extend({
	template: "#page",
	data: {
		who: "World"
	},
	init: function() {
		window.page = this;
	}
});