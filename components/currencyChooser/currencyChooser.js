CURRENCIES= {
	EUR: {sign: "€", value: 1, name: "Euro", format: function(x){return "€ "+x.toFixed(2);}},
	HUF: {sign: "Ft", value: 1/309, name: "Hungarian Forint", format:  function(x){return x.toFixed(0)+" Ft";}}
};

Ractive.components.currencyChooser = Component.extend({
	template: "#currencyChooser",
	data: {
		currencies: CURRENCIES,
		currency: "HUF"
	},
	init: function() {
		this._super();
		
		this.on("changeCurrency", function(event, value){
			this.set("currency", value);
		});
		
		var self = this;
		this.observe("currency", function(newValue, oldValue) {
			var translations = TRANSLATIONS[newValue];
			afterwards(function(){
				page.set('amt', function(sum, currency) {
					if (typeof(sum) === 'undefined' || sum === null || !currency) return;
					var original = CURRENCIES[currency];
					var current = CURRENCIES[self.data.currency];
					return current.format(sum * (original.value / current.value));
				});
			});
		});
		
	}
});