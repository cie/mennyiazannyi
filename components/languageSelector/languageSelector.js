TRANSLATIONS = {
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