
/**
* app.js
*/
Component = Ractive.extend({
	
});
Ractive.components.page = Ractive.extend({
	template: "#page",
	data: {
		who: "World"
	},
	adaptors: [ 'Backbone' ],
	init: function() {
		this._super();
	}
});