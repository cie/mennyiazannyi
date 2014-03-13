
app.directive("transaction", function() {
	return {
		restrict: "A",
		scope: {
			'value': '=?value',
			'class': '@class'
		},
		templateUrl: tmpl("transaction"),
		controller: function($scope) {
			
		}
	}
});