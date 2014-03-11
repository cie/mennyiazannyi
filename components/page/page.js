
router.route(":tab(/*others)", null, function(tab) {
	page.set("tab", tab);
});

Ractive.components.page = Component.extend({
	template: "#page",
	data: {
		who: "World"
	},
	init: function() {
		if (this._super) this._super();
		window.page = this;
	}
});

