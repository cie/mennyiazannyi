
app.directive("transaction", function() {
	return {
		restrict: "E",
		scope: {
			'value': '=value',
			'class': '=class'
		},
		templateUrl: tmpl("transaction"),
		controller: function() {
			
		}
	}
});