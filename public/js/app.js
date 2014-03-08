
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
users$ = db$.child("users");



/**
 * Router
 */

Router = Backbone.Router.extend({
	routes: {
	}
});
router = new Router();


/**
 * Ractive settings
 */
Ractive.defaults.debug = true;


/**
 * The root of all components
 */
Component = Ractive.extend({
	
	init: function() {
		var _this = this; 
		afterwards(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // calculate globals from global and local list of globals
	        var globals = GLOBALS.slice(0);
	        if (this.globals) {
	        	globals = globals.concat(this.globals);
	        }
	        
	        // introduce these only if not the top level component 
	        if (_this !== page) {
	          pullers = {};
	          pushers = {};
	          _this.pushDisabled = true;
	          
	          for (_i = 0, _len = globals.length; _i < _len; _i++) {
	            variable = globals[_i];
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
			"Log out": "Kijelentkezés",
			"Settings": "Beállítások",
			"Date": "Dátum",
			"From": "Kitől",
			"To": "Kinek",
			"Sum": "Összeg",
			"Currency": "Pénznem",
			"Text": "Szöveg",
			"Categories": "Kategóriák",
			
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
	// try to find out the user's language
	var lang = navigator.language || navigator.userLanguage;
	var m = lang.match(/([a-z]+)(-[A-Z]+)?/);
	if (m) {
		if (TRANSLATIONS[m[1]]) {
			return m[1];
		}	
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


Ractive.components.transaction = Component.extend({
	template: "#transaction",
	data: {
	},
	init: function() {
		this._super();
		
		this.on({
			'moveRight': function(event) {
				$(event.node).parent().next().children("input").focus();
			}
		});
	}
});

Transactions = Backbone.Firebase.Collection.extend({
});

Ractive.components.transactions = Component.extend({
	adapt: ['Backbone'],
	template: "#transactions",
	data: {
		newTransaction: {},
		filter: function(transaction) {
			return transaction;
		}
	},
	init: function() {
		this._super();
		
		this.userObserver = page.observe("user", function(user, oldValue) {
			if (user && user.uid) {
				this.data.transactions = new Transactions([], {
					firebase: users$.child(user.uid).child("transactions")
				});
			} else {
				this.data.transactions = [];
			}
			this.update();
			
		});
		
		this.on({
			'moveDown': function(event, direction) {
				console.log(event);
			},
			'addTransaction': function() {
				var t = this.data.newTransaction;
				this.data.transactions.push({
					date:t.date,
					from:t.from,
					to:t.to,
					sum:t.sum,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				});
				this.set('newTransaction.sum', "");
				this.set('newTransaction.text', "");
			},
			'teardown': function() {
				this.userObserver.cancel();
				
				window.transactions = null;
			} 
		});
		
		window.transactions = this;
	}
});Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		this._super();
		
		this.auth = new FirebaseSimpleLogin(db$, function(error, user) {
			if (!error) {
				page.set("user", user);
			} else {	
				
			}
		});
		
		this.on({
			"login": function(event, provider) {
				this.auth.login(provider);
			},
			"logout": function(event, provider) {
				this.auth.logout();
			}
		});
		
		window.userAccount = this;
	}
});