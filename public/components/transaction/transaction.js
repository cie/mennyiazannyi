app.factory("updateIndex", function() {
	VERSION = 9;

    function updateIndex(tr) {
        // save date as number
        tr.$priority = +new Date(tr.date);

        // index keywords
        var keywords = [tr.from, tr.to, tr.currency, tr.text], kws = {};
		if (tr.categories) {
			keywords = keywords.concat(tr.categories.split(","));
		}
        _.each(keywords, function(s){ 

			if (!s) return;

			s = updateIndex.sanitize(s);
			if (!s) return;

			kws[s] = true;

			// add type: tag
			var m;
			if (m = s.match(/^([^:]+):/)) {
				kws[m[1]] = true;
			}
		});
		
		// add from:... fields
		_.each(["from", "to", "currency", "text", "sum"], function(field) {
			kws[field + ":" + updateIndex.sanitize(tr[field])] = true;
		});

		
		if (tr.deleted) {
			kws.deleted = true;
		} else {
			kws.all = true;
		}

        tr.keywords = kws;
		tr.indexVersion = VERSION;
    }

	updateIndex.sanitize = function (s) {
		// convert to string
		s = ""+s;
		// trim
		s = s.trim();
		// lower case
		s = s.toLowerCase();
		// sane whitespaces
		s = s.replace(/\s+/g, " ");
		// no .#$/[] a la Firebase
		s = s.replace(/[.#$\/\[\]]/g, "");
		// remove space after :
		s = s.replace(/:\s+/g, ":");

		return s;
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
