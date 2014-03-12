app.directive("userAccount", function() {
	return {
		restrict: "E",
		templateUrl: tmpl("userAccount"),
		controller: function($scope, $firebase, $firebaseSimpleLogin) {
			$scope.auth = $firebaseSimpleLogin(dbRef);
		}
	}
});