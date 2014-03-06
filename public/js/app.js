
/**
* app.js
*/


/**
 * Firebase connections
 */
FIREBASE = "https://mennyiazannyi.firebaseio.com/";

db$ = new Firebase(FIREBASE);



/**
 * Models
 */



/**
 * Ractive settings
 */
Ractive.defaults.debug = true;


/**
 * The root of all components
 */
Component = Ractive.extend({
});Ractive.components.languageSelector = Component.extend({
	template: "#languageSelector",
	data: {
		'lang': 'hu'
	},
	init: function() {
		
	}
});
Ractive.components.page = Ractive.extend({
	template: "#page",
	data: {
		who: "World"
	},
	adaptors: [ 'Backbone' ],
	init: function() {
		
	}
});Ractive.components.userAccount = Component.extend({
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