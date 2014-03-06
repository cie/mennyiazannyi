
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
           't'
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
		afterwards(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // introduce these only if not the top level component 
	        if (_this !== page) {
	          pullers = {};
	          pushers = {};
	          _this.pushDisabled = true;
	          
	          for (_i = 0, _len = GLOBALS.length; _i < _len; _i++) {
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
	                  page.set(variable, newValue);
	                }
	              };
	            })(variable);
	          }
	          pullerObserver = page.observe(pullers);
	          _this.observe(pushers);
	          _this.pushDisabled = false;
	          return _this.on("teardown", function() {
	            return pullerObserver.cancel();
	          });
	        }
	      });
	}
});

/*
 * Helpers
 */

/**
 * Schedules a function
 */
function afterwards(fn) {
	setTimeout(fn, 0);
}Ractive.components.expressionBar = Component.extend({
	template: "#expressionBar",
	data: {
		
	},
	init: function() {
		
	}
});TRANSLATIONS = {
		hu: {
			"Log in with": "Bejelentkezés",
			"transactions": "Tranzakciók",
			"budget": "Büdzsé",
			"flow": "Pénzfolyam",
			"love": "Szeretet",
			"Language": "Nyelv",
			"Query help": "Segítség a lekérdezésekhez",
			
			"LAST":""
		},
		en : {
			"transactions": "Transactions",
			"budget": "Budget",
			"flow": "Money flow",
			"love": "Love",
			"Query help": "Help for queries",
			
			"LAST":""
		}
}

function getLang() {
	lang = navigator.language || navigator.userLanguage;
	m = lang.match(/([a-z]+)-[A-Z]+/);
	if (TRANSLATIONS[m[1]]) {
		return m[1];
	}
	// default to English
	return 'en';
}

Ractive.components.languageSelector = Component.extend({
	template: "#languageSelector",
	data: {
		lang: getLang(),
		langs: {
			hu: {flag:'hu', name:'Magyar'}
		    ,en: {flag:'gb', name:'English'}
		}
	},
	init: function() {
		this._super();
		
		this.on("changeLanguage", function(event, value){
			this.set("lang", value);
		});
		
		this.observe("lang", function(newValue, oldValue) {
			var translations = TRANSLATIONS[newValue];
			afterwards(function(){
				page.set('t', function(term) {
					return translations[term] || term;
				});
			});
		});
		
		window.languageSelector = this;
	}
});
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
Ractive.components.page = Component.extend({
	template: "#page",
	data: {
		who: "World"
	},
	init: function() {
		window.page = this;
	}
});Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		this._super();
		
		auth = new FirebaseSimpleLogin(db$, function(error, user) {
			if (!error) {
				page.set("user", user);
			} else {	
				
			}
		});
		
		window.userAccount = this;
	}
});