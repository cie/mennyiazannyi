
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
app.filter("toArray", function() {
	return function(collection) {
		return _.toArray(collection);
	}
});


/**
 * directives
 */
app.directive("specialKeys", function() {
	return {
		scope: {
			onEnter: "&",
			onEsc: "&"
		},
		link: function(scope, element, attrs) {
			element.on("keydown", function(e) {
				if (e.which == 13) {
					scope.$apply(function(){
						scope.onEnter();
					});
				}
				if (e.which == 27) {
					scope.$apply(function(){
						scope.onEsc();
					});
				}
			});
		}
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
	// default to HUF
	$rootScope.currency = "HUF";
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

app.factory("compileExpression", function(updateIndex) {
    return function(expr) {
        // this is too complex now...
        /*clauses = expr.split(";").map(function(clause){
            var terms = clause.split(',').map(function(term) {
                if (term.charAt(0) === '-') {
                    term = term.substr(1);
                    return [term, false];
                }
                return [term, true];
            });
        });*/

        // just hacking it in regxy:)

        // not
        expr = expr.replace(/(^|[,;(])-/g, "$1!");
        // or
        expr = expr.replace(/;/g, "||");
        // and
        expr = expr.replace(/,/g, "&&");
        // clean <<>>s
        expr = expr.replace(/<<|>>/g, "");
        // terms in <<>>s
        expr = expr.replace(/([^|&!()]+)/g, "<<$1>>");
        // dates
        expr = expr.replace(/<<([0-9]{4})>>/g, "y.apply(tr,[$1])");
        expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})>>/g, "ym.apply(tr,[$1,$2])");
        expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})>>/g, "ymd.apply(tr,[$1,$2,$3])");
        // finalize terms (first remove quotes and backslashes)
        expr = expr.replace(/["\\]/g, "");

        expr = expr.replace(/<<(.*?)>>/g, function(match, term) {
			term = updateIndex.sanitize(term);
			term = term.replace(/[\\"]/g, "");
			return "tr.keywords[\"" + term + "\"]";
		});

        function y(year) {
            return this.date.getFullYear() == year;
        }
        function ym(year, month) {
            var d = this.date;
            return d.getFullYear() == year && d.getMonth()+1 == month;
        }
        function ymd(year, month, day) {
            var d = this.date;
            return d.getFullYear() == year && d.getMonth()+1 == month && d.getDate() == day;
        }
            
        return eval("(function(tr){return " + expr + "})");
    }
});

app.directive("expressionBar", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("expressionBar"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
		},
		controller: function($scope, $rootScope) {
			$scope.localExpression = $rootScope.expression;

			$scope.updateExpression = function() {
				$rootScope.expression = $scope.localExpression;
			}
			$scope.revertExpression = function() {
				$scope.localExpression = $rootScope.expression;
			}
		}
	}
});

VERSES = {
		'1Tim6:17-19': {
			'hu': "Azoknak pedig, akik e világban gazdagok, parancsold meg," +
				  " hogy ne legyenek gőgösek, és ne a bizonytalan" +
				  " gazdagságban reménykedjenek, hanem Istenben, aki" +
				  " megélhetésünkre mindent bőségesen megad nekünk." +
				  " A gazdagok tegyenek jót, legyenek gazdagok a jó"+
			      " cselekedetekben, adakozzanak szívesen, javaikat" +
			      " osszák meg másokkal, gyűjtsenek maguknak jó alapot" +
			      " a jövendőre, hogy elnyerjék az igazi életet. (1 Tim 6:17–19 BT)",
			'en': "Instruct those who are rich in this present world" +
					" not to be conceited or to fix their hope on the" +
					" uncertainty of riches, but on God, who richly" +
					" supplies us with all things to enjoy. Instruct" +
					" them to do good, to be rich in good works, to be" +
					" generous and ready to share, storing up for" +
					" themselves the treasure of a good foundation" +
					" for the future, so that they may take hold of" +
					" that which is life indeed. (1 Tim 6:17—19 NASB)"
		}
};

app.directive("footer", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("footer"),
		controller: function($scope) {
			// choose a random verse
			var verses = _.toArray(VERSES);
			$scope.verse = verses[_.random(0, verses.length-1)];
		}
	}
});app.directive("import", function() {
	return {
		restrict : "E",
		templateUrl : tmpl("import"),
		link : function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller : function($scope, $rootScope, $sce) {
			$.ajax("import/import.min.js", {
				dataType : "text",
				success : function(data) {
					$scope.$apply(function() {
						$scope.bookmarklet = $sce.trustAsHtml($("<a>").attr("href", data).text(
								$rootScope.t("Export transactions")).appendTo("<span>")
								.parent().html());
					});
				}
			});

			$scope.csv = "Hello";

			$scope.import = function() {
				var csv = $scope.csv;
				var lines = csv.split("\n");
				var fields = lines.splice(0, 1)[0].split(",");
				var transactions = _.map(lines, function(l) {
					var values = JSON.parse("[" + l + "]");
					var record = {}
					_.each(fields, function(f, i) {
						record[f] = values[i];
					});
					return record;
				});
                                _.each(transactions, function(tr){
                                    
                                    // XXX this should be in bookmarklet
                                    tr.date = tr.date.substr(0,10);
                                    
                                    // XXX this also
                                    tr.text = tr.comment;
                                    tr.comment = undefined;

                                    $rootScope.user.$child('transactions').$add(tr).then(function() {
                                        // XXX HACK: avoid re-sorting on each addition
                                        location.reload();
                                    });
                                });
			}
		}
	}
});
app.directive("intro", function() {
	return {
		restrict: "EA",
		templateUrl: tmpl("intro"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope) {
			
		}
	}
});TRANSLATIONS = {
		hu: {
			"Hello": "Helló",
			"Log in": "Bejelentkezés",
			"Log in with": "Bejelentkezés",
			"transactions": "Tranzakciók",
			"budget": "Büdzsé",
			"flow": "Pénzfolyam",
			"love": "Szeretet",
			"Language": "Nyelv",
			"Query help": "Segítség a lekérdezésekhez",
			"Log out": "Kijelentkezés",
			"Settings": "Beállítások",
			"Nothing special here yet :)": "Még nincs itt semmi érdekes :)",
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

app.factory("updateIndex", function() {
	VERSION = 5;

    function updateIndex(tr) {
        // save date as number
		tr.timestamp = undefined;
        tr.$priority = +new Date(tr.date);

        // index keywords
        var keywords = [tr.from, tr.to, tr.currency, tr.text], kws = {};
		if (tr.categories) {
			keywords = keywords.concat(tr.categories.split(","));
		}
        _.each(keywords, function(s){ 

			if (!s) return;
			s = (""+s).trim();
			if (!s) return;

			s = updateIndex.sanitize(s);

			kws[s] = true
		});
		
		if (tr.deleted) {
			kws.deleted = true;
		} else {
			kws.all = true;
		}

        tr.keywords = kws;
		tr.indexVersion = VERSION;
    }

	updateIndex.sanitize = function (s) {
		// lower case
		s = s.toLowerCase();
		// sane whitespaces
		s = s.replace(/\s+/g, " ");
		// no .#$/[] a la Firebase
		s = s.replace(/[.#$\/\[\]]/g, "");

		return s;
	}


	updateIndex.outdated = function(tr) {
		return !tr.indexVersion || tr.indexVersion < VERSION;
	};

	return updateIndex;
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
				element.on("focus", "input", function() {
					scope.$apply(scope.onFocus);
				});
			}
			element.on("blur", "input", function() {
				scope.$apply(function() {
					scope.updateIndex(scope.value);
				})
			});
		},
		controller: function($scope, myAccount, updateIndex) {
			$scope.myAccount = myAccount;
			$scope.updateIndex = updateIndex;

			// set classes based on expense/income
			$scope.$watch("myAccount(value.from)", function(expense) {
				$scope.element.toggleClass("expense", expense);
			});
			$scope.$watch("myAccount(value.to)", function(income) {
				$scope.element.toggleClass("income", income);
			});
			$scope.$watch("value.deleted", function(deleted) {
				$scope.element.toggleClass("deleted", !!deleted);
				updateIndex($scope.value);
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
                if (!acctName) return false;
		acctName = acctName.toLowerCase();
		if (acctName == MY_ACCOUNT.toLowerCase()) return true;
		for (lang in TRANSLATIONS) {
			var translation = TRANSLATIONS[lang][MY_ACCOUNT];
			if (translation && translation.toLowerCase() === acctName) return true;
		}
		return false;
	}
});

app.filter("transactionFilter", function(compileExpression, updateIndex) {
	return function(transactions, expression) {
		var filter = compileExpression(expression);
		return _.filter(transactions,function(tr) {
			if (updateIndex.outdated(tr)) {
				updateIndex(tr);
			}
			return filter(tr);
		});
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
					var userNode = $firebase(usersRef.child(user.uid))
					userNode.$update({registered: true});
					
					userNode.$bind($rootScope, "user");
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