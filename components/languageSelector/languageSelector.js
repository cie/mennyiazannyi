Ractive.components.languageSelector = Component.extend({
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