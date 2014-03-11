CURRENCIES= {
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
});