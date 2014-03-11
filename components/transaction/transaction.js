
Ractive.components.transaction = Component.extend({
	template: "#transaction",
	data: {
	},
	init: function() {
		if (this._super) this._super();
		
		this.on({
			'moveRight': function(event) {
				$(event.node).parent().next().children("input").focus();
			}
		});
	}
});