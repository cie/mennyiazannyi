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
});*/