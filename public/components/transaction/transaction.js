app.factory("updateIndex", function() {
	VERSION = 5;

    function updateIndex(tr) {
        // save date as number
		tr.timestamp = undefined;
        tr.$priority = +new Date(tr.date);

        // index keywords
        var keywords = [tr.from, tr.to, tr.currency, tr.text], kws = {};
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

			kws[s] = true
		});
		
		if (tr.deleted) {
			kws.deleted = true;
		} else {
			kws.all = true;
		}

        tr.keywords = kws;
		tr.indexVersion = VERSION;
    }

	updateIndex.outdated = function(tr) {
		return !tr.indexVersion || tr.indexVersion < VERSION;
	};

	return updateIndex;
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
				updateIndex($scope.value);
			});
		}
	}
});
