app.directive("userAccount", function() {
	return {
		restrict: "E",
		templateUrl: tmpl("userAccount"),
		controller: function($scope, $firebase, $firebaseSimpleLogin) {
			$scope.auth = $firebaseSimpleLogin(dbRef);
			
			$scope.login = function(provider) {
				$scope.auth.$login(provider);
			};
			$scope.logout = function() {
				$scope.auth.$logout();
			} 
		}
	}
});