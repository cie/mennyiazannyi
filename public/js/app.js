
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



/* ----------------- End of settings ---------------- */


/**
 * Firebase connections
 */

dbRef = new Firebase(FIREBASE);
usersRef = dbRef.child("users");

/**
 * the app
 */
var app = angular.module("app", ["firebase"]);


/**
 * filters
 */
app.filter("map", function() {
	return function(collection, mapping) {
		if (!mapping) mapping = function(x) {return x}
		return _.map(collection, mapping);
	}
});

/**
 * template url
 */
function tmpl(name) {
	return "components/"+name+"/"+name+".html";
}

/*Ractive.components.amount = Component.extend({
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
});*/CURRENCIES= {
	EUR: {sign: "€", value: 1, name: "Euro", format: function(x){return "€ "+x.toFixed(2);}},
	HUF: {sign: "Ft", value: 1/309, name: "Hungarian Forint", format:  function(x){return x.toFixed(0)+" Ft";}},
	USD: {sign: "$", value: 1/1.39, name: "U.S. Dollar", format:  function(x){return "$ "+x.toFixed(2);}}
};

// redefine currency filter
app.filter("currency", function($rootScope) {
	return function(amount) {
		return "<currency> " + $rootScope.currency;
	};
});

app.run(function($rootScope) {
	$rootScope.currency = "EUR";
})


app.directive("currencyChooser", function(){
	return {
		restrict: "E",
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		templateUrl: tmpl("currencyChooser"),
		controller: function($scope, $rootScope) {
			$scope.currencies = CURRENCIES;
			$scope.chooseCurrency = function(currency) {
				$rootScope.currency = currency;
			};
		}
	}		
});
			
		/*
		
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
		*/app.run(function($rootScope){
	$rootScope.expression = "all";
});

app.directive("expressionBar", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("expressionBar"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
		},
		controller: function($scope) {
		}
	}
});TRANSLATIONS = {
		hu: {
			"Hello": "Helló",
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
};

LANGS = {
		hu: {flag:'hu', name:'Magyar'}
		,en: {flag:'gb', name:'English'}
};

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

app.run(function($rootScope) {
	$rootScope.lang = getLang();
	$rootScope.t = function(term) {
		return TRANSLATIONS[$rootScope.lang][term] || term;
	}
});

app.directive("languageSelector", function() {
	return {
		restrict: "E",
		templateUrl: tmpl("languageSelector"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope, $rootScope) {
			$scope.langs = LANGS;
			
			$scope.selectLanguage = function(lang) {
				$rootScope.lang = lang;
			};
		}
	}
});
app.directive("navbar", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("navbar"),
		controller: function($scope) {
			$scope.tabs = {
				transactions: {icon:"transfer"},
				budget: {icon:"briefcase"},
				flow: {icon:"stats"},
				love: {icon:"heart-empty"}
			};
		}
	}
});
app.directive("page", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("page"),
		controller: function($scope) {
			$scope.tab = "transactions";
		}
	};
});


app.directive("transaction", function() {
	return {
		restrict: "A",
		scope: {
			'value': '=?value',
			'onFocus': '&onFocus'
		},
		transclude: true,
		templateUrl: tmpl("transaction"),
		link: function(scope, element, attr) {
			scope.element = element;
			if (scope.onFocus) {
				element.children("td").children("input").on("focus", function() {
					scope.$apply(scope.onFocus);
				});
			}
		},
		controller: function($scope, myAccount) {
			$scope.myAccount = myAccount;
			
			// set classes based on expense/income
			$scope.$watch("myAccount(value.from)", function(expense) {
				$scope.element.toggleClass("expense", expense);
			});
			$scope.$watch("myAccount(value.to)", function(income) {
				$scope.element.toggleClass("income", income);
			});
			$scope.$watch("value.deleted", function(deleted) {
				$scope.element.toggleClass("deleted", !!deleted);
			});
		}
	}
});

MY_ACCOUNT = "Me";

/**
 * Tell if an account is owned by the user.
 */
app.factory("myAccount", function() {
	return function(acctName) {
		acctName = acctName.toLowerCase();
		if (acctName == MY_ACCOUNT.toLowerCase()) return true;
		for (lang in TRANSLATIONS) {
			var translation = TRANSLATIONS[lang][MY_ACCOUNT];
			if (translation && translation.toLowerCase() === acctName) return true;
		}
		return false;
	}
});

app.directive("transactions", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("transactions"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
			scope.element = element;
		},
		controller: function($scope, $firebase, $rootScope, myAccount, $timeout) {
			
			$scope.selectTransaction = function(id) {
				$scope.activeTransaction = id;
			};
		
			$scope.newTransaction = {
				date:  new Date().toISOString().substring(0,10),
				from: "",
				to: "",
				sum: "", 
				currency: $rootScope.currency,
				text: "",
				categories: ""
			};
			
			$rootScope.$watch("currency", function(currency) {
				// if no sum entered
				if (!+$scope.newTransaction.sum) {
					$scope.newTransaction.currency = currency;
				}
			});
			
			$scope.addTransaction = function() {
				var t = $scope.newTransaction;
				$scope.user.$child("transactions").$add({
					date:t.date,
					from:t.from,
					to:t.to,
					 // enable decimal comma, avoid NaNs
					sum: +(""+t.sum).replace(",", ".") || 0,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				}).then(function(id){
					// select new transaction
					$timeout(function() {
						$scope.activeTransaction = id.name();
					},0);
				});
				// keep date as it is
				//this.set('newTransaction.date', new Date().toDateString());
				if (!myAccount(t.from)) $scope.newTransaction.from = "";
				if (!myAccount(t.to))   $scope.newTransaction.to = "";
				$scope.newTransaction.sum = "";
				$scope.newTransaction.currency = $rootScope.currency;
				$scope.newTransaction.text = "";
				$scope.newTransaction.categories = "";
				
				// focus first item in new row
				$("table>tfoot>tr input",$scope.element).first().focus()
				
			};
			 
			$scope.deleteTransaction = function(tr) {
				tr.deleted = true;
			}
			$scope.restoreTransaction = function(tr) {
				tr.deleted = false;
			}
		}
	}
});
	
			/*
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
					
				},
				'teardown': function() {
					this.userObserver.cancel();
					this.currencyObserver.cancel();
					
					window.transactions = null;
				} 
			});*/

app.directive("userAccount", function() {
	return {
		restrict: "EA",
		templateUrl: tmpl("userAccount"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
			$rootScope.auth = $firebaseSimpleLogin(dbRef);
			
			$rootScope.$watch("auth.user", function(user, oldValue) {
				if (user) {
					$firebase(usersRef.child(user.uid))
					  .$bind($rootScope, "user");
				} else {
					$rootScope.user = undefined;
				}
			});
			
			$scope.login = function(provider) {
				$rootScope.auth.$login(provider);
			};
			
			$scope.logout = function() {
				$rootScope.auth.$logout();
			};
		}
	}
});