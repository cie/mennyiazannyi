TRANSLATIONS = {
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