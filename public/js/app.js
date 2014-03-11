
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
           't',
           'amt'
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
	
	beforeInit: function() {
		var _this = this; 
		afterwards(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // calculate globals from global and local list of globals
	        var globals = GLOBALS.slice(0);
	        if (_this.globals) {
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
}Ractive.components.amount = Component.extend({
	template: "#amount",
	data: {
		value: {
			sum: 0,
			currency: "EUR"
		},
		currency: "EUR",
		formattedValue : "0 €"
	},
	lazy: true,
	init: function() {
		if (this._super) this._super();
		
		var updating = false;
		
		this.observe("value", function(value) {
			updating = true;
			
			this.set("formattedValue", page.data.amt(value));			
			
			updating = false;
		});
		
		// don't parse formattedValue now
		updating = true;
		this.observe("formattedValue", function(formattedValue) {
			if (updating) return;
			
			var newValue = page.data.invAmt(formattedValue);
			this.set({
				"value.sum": newValue.sum,
				"value.currency": newValue.currency
			});
			console.log(this.data.value);
		});
		updating = false;

	}
});CURRENCIES= {
	EUR: {sign: "€", value: 1, name: "Euro", format: function(x){return "€ "+x.toFixed(2);}},
	HUF: {sign: "Ft", value: 1/309, name: "Hungarian Forint", format:  function(x){return x.toFixed(0)+" Ft";}},
	USD: {sign: "$", value: 1/1.39, name: "U.S. Dollar", format:  function(x){return "$ "+x.toFixed(2);}}
};

Ractive.components.currencyChooser = Component.extend({
	template: "#currencyChooser",
	data: {
		currencies: CURRENCIES,
		currency: "HUF"
	},
	init: function() {
		if (this._super) this._super();
		
		this.on("changeCurrency", function(event, value){
			this.set("currency", value);
		});
		
		var self = this;
		this.observe("currency", function(newValue, oldValue) {
			var translations = TRANSLATIONS[newValue];
			afterwards(function(){
				page.set('amt', function(a) {
					if (!a || typeof(a.sum) === 'undefined' || a.sum === null || !a.currency) return;
					var result = CURRENCIES[a.currency].format(a.sum);
					if (self.data.currency !== a.currency) {
						var current = CURRENCIES[self.data.currency];
						var original = CURRENCIES[a.currency];
						result = result + " (" + current.format(a.sum * (original.value / current.value)) + ")";
					}
					return result;
				});
				page.set('invAmt', function(s) {
					if (!s) return;
					s = s.replace(/\([^)]*\)/, "")
					var m = s.match(/[0-9]*([,.][0-9]*)/);
					if (!m) return null;
					var sum = +m[0].replace(/,/g, ".");
					var sign = s.replace(m[0], "").trim();
					for (var id in CURRENCIES) {
						if (CURRENCIES[id].sign == sign) {
							return {sum: sum, currency: id};
						}
					}
					// fall back to current currency. XXX not sure if good
					return {sum: sum, currency: currencyChooser.data.currency};
				});
			});
		});
		
		window.currencyChooser = this;
		
	}
});Ractive.components.expressionBar = Component.extend({
	template: "#expressionBar",
	data: {
		
	},
	init: function() {
		if (this._super) this._super();
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
			"Comment": "Megjegyzés",
			"Categories": "Kategóriák",
			
			"Hungarian Forint": "Forint",
			"Euro": "Euró",
			"U.S. Dollar": "USA Dollár",
			
			"Settings": "Beállítások",
			"Log out": "Kijelentkezés",
			"Me": "Én",
			
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
		if (this._super) this._super();
		
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
		if (this._super) this._super();
		
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
		if (this._super) this._super();
		window.page = this;
	}
});


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

Transactions = Backbone.Firebase.Collection.extend({
});

MY_ACCOUNT = "Me";

/**
 * Tell if an account is owned by the user.
 */
myAccount = function(acctName) {
	acctName = acctName.toLowerCase();
	if (acctName == MY_ACCOUNT.toLowerCase()) return true;
	for (lang in TRANSLATIONS) {
		var translation = TRANSLATIONS[lang][MY_ACCOUNT];
		if (translation && translation.toLowerCase() === acctName) return true;
	}
	return false;
}

Ractive.components.transactions = Component.extend({
	adapt: ['Backbone'],
	template: "#transactions",
	data: {
		newTransaction: {
			date: new Date(),
			from: "",
			to: "",
			amount: {
				sum: 0,
				currency: "EUR"
			},
			text: "",
			categories: ""
		},
		filter: function(transaction) {
			return transaction;
		}
	},
	init: function() {
		if (this._super) this._super();
		
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
		
		var self = this;
		this.currencyObserver = currencyChooser.observe("currency", function(currency) {
			if (! self.get("newTransaction.sum")) {
				self.set("newTransaction.currency", currency);
			}
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
					 // enable decimal comma, avoid NaNs
					sum: +(""+t.sum).replace(",", ".") || 0,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				});
				this.set('newTransaction.date', new Date().toDateString);
				if (!myAccount(t.from)) this.set('newTransaction.from', "");
				if (!myAccount(t.to))   this.set('newTransaction.to',   "");
				this.set('newTransaction.sum',  "");
				this.set('newTransaction.currency',  currencyChooser.data.currency);
				this.set('newTransaction.text', "");
				this.set('newTransaction.categories', "");
				
				// focus first item in new row
				$("table>tfoot>tr input",this.el).first().focus()
			},
			'teardown': function() {
				this.userObserver.cancel();
				this.currencyObserver.cancel();
				
				window.transactions = null;
			} 
		});
		
		window.transactions = this;
	}
});Ractive.components.userAccount = Component.extend({
	template: "#userAccount",
	init: function() {
		if (this._super) this._super();
		
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