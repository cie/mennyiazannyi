app.factory("updateIndex", function() {
    return function(tr) {
        // save date as number
        tr.timestamp = +new Date(tr.date);

        // index keywords
        var keywords = [tr.from, tr.to, tr.currency, tr.text], keywordsMap = {};
		if (tr.categories) {
			keywords = keywords.concat(tr.categories.split(","));
		}
        _.each(keywords, function(s){ 

			if (!s) return;
			s = (""+s).trim();
			if (!s) return;

			// lower case
			s = s.toLowerCase();
			// sane whitespaces
			s = s.replace(/\s+/g, " ");
			// no .#$/[] a la Firebase
			s = s.replace(/[.#$\/\[\]]/g, "");

			keywordsMap[s] = true
		});
        tr.keywords = keywordsMap;
    }
});
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
				element.on("focus", "input", function() {
					scope.$apply(scope.onFocus);
				});
			}
			element.on("blur", "input", function() {
				scope.$apply(function() {
					scope.updateIndex(scope.value);
				})
			});
		},
		controller: function($scope, myAccount, updateIndex) {
			$scope.myAccount = myAccount;
			$scope.updateIndex = updateIndex;

			// set classes based on expense/income
			$scope.$watch("myAccount(value.from)", function(expense) {
				$scope.element.toggleClass("expense", expense);
			});
			$scope.$watch("myAccount(value.to)", function(income) {
				$scope.element.toggleClass("income", income);
			});
			$scope.$watch("value.deleted", function(deleted) {
				$scope.element.toggleClass("deleted", !!deleted);
			});
		}
	}
});
