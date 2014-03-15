app.factory("updateIndex", function() {
	VERSION = 10;

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
			var s = updateIndex.sanitize(tr[field])
			if (s) {
				kws[field + ":" + s] = true;
				// XXX first-word only 
				kws[field + ":" + s.split(' ')[0]] = true;
			}
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
		},
		controller: function($rootScope, $scope, myAccount, updateIndex, $timeout) {

			// lazy committing
			$scope.local = angular.copy($scope.value);
			$scope.commit = function() {
				$scope.value = angular.copy($scope.local);
			}

			$scope.myAccount = myAccount;
			$scope.updateIndex = updateIndex;

			$scope.$watch("''+value.from+'()'+value.to+'()'+value.deleted", function() {
				var tr=$scope.value;
				var fromMe = myAccount(tr.from), toMe = myAccount(tr.to);

				$scope.element.toggleClass("expense", fromMe && !toMe);
				$scope.element.toggleClass("income",  toMe && !fromMe);
				$scope.element.toggleClass("external", !fromMe && !toMe);
				$scope.element.toggleClass("internal", fromMe && toMe);
				$scope.element.toggleClass("deleted", !!tr.deleted);
			});
			$scope.$watch("value.active", function(value){
				$scope.element.toggleClass("active", !!value);
			});
			/*$rootScope.$watch("filter", function(filter) {
				$timeout(function(){
					$scope.element.toggle(!!filter($scope.value));
				}, 0);
			});*/

		}
	}
});
