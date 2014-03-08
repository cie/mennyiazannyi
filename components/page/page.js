
router.route(":tab(/*others)", null, function(tab) {
	page.set("tab", tab);
});

Ractive.components.page = Component.extend({
	template: "#page",
	data: {
		who: "World"
	},
	init: function() {
		window.page = this;
	}
});

