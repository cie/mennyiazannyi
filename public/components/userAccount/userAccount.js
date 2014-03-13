app.directive("userAccount", function() {
	return {
		restrict: "EA",
		templateUrl: tmpl("userAccount"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope, $firebase, $firebaseSimpleLogin) {
			$scope.auth = $firebaseSimpleLogin(dbRef);
			
			$scope.login = function(provider) {
				$scope.auth.$login(provider);
			};
			$scope.logout = function() {
				$scope.auth.$logout();
			};
		}
	}
});