
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
				element.children("td").children("input").on("focus", function() {
					scope.$apply(scope.onFocus);
				});
			}
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