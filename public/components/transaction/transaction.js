
app.directive("transaction", function() {
	return {
		restrict: "A",
		scope: {
			'value': '=?value'
		},
		templateUrl: tmpl("transaction"),
		link: function(scope, element, attr) {
			scope.element = element;
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
		}
	}
});