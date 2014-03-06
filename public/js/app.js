
/**
* app.js
*/
/*
 * Settings
 */

/**
 * Firebase address
 */
FIREBASE = "https://mennyiazannyi.firebaseio.com/";

/**
 * Globally accessible variables
 */
GLOBALS = [
           "lang"
           ];


/* ----------------- End of settings ---------------- */


/**
 * Firebase connections
 */

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
	
	adaptors: [ 'Backbone' ],
	
	init: function() {
		var _this = this; 
		setTimeout(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // introduce these only if not the top level component 
	        if (_this !== page) {
	          pullers = {};
	          pushers = {};
	          _this.pushDisabled = true;
	          
	          for (_i = 0, _len = GLOBAL_VARS.length; _i < _len; _i++) {
	            variable = GLOBALS[_i];
	            pullers[variable] = (function(variable) {
	              return function(newValue) {
	                _this.pushDisabled = true;
	                _this.set(variable, newValue);
	                _this.pushDisabled = false;
	              };
	            })(variable);
	            pushers[variable] = (function(variable) {
	              return function(newValue) {
	                if (!_this.pushDisabled) {
	                  Page.set(variable, newValue);
	                }
	              };
	            })(variable);
	          }
	          pullerObserver = Page.observe(pullers);
	          _this.observe(pushers);
	          _this.pushDisabled = false;
	          return _this.on("teardown", function() {
	            return pullerObserver.cancel();
	          });
	        }
	      }, 0);
	}
});Ractive.components.expressionBar = Component.extend({
	template: "#expressionBar",
	data: {
		
	},
	init: function() {
		
	}
});Ractive.components.languageSelector = Component.extend({
	template: "#languageSelector",
	data: {
		lang: 'hu',
		flag: 'hu',
		langs: {
			hu: {flag:'hu', name:'Magyar'},
		    en: {flag:'gb', name:'English'}
		}
	},
	init: function() {
		
	}
});
Ractive.components.navbar = Ractive.extend({
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
		
	}
});
Ractive.components.page = Ractive.extend({
	template: "#page",
	data: {
		who: "World"
	},
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