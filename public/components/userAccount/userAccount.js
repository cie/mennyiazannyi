
app.directive("userAccount", function() {
	return {
		restrict: "EA",
		templateUrl: tmpl("userAccount"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
			$rootScope.auth = $firebaseSimpleLogin(dbRef);
			
			$rootScope.$watch("auth.user", function(user, oldValue) {
				if (user) {
					var userNode = $firebase(usersRef.child(user.uid))
					userNode.$update({registered: true});
					
					userNode.$bind($rootScope, "user");
				} else {
					$rootScope.user = undefined;
				}
			});
			
			$scope.login = function(provider) {
				$rootScope.auth.$login(provider);
			};
			
			$scope.logout = function() {
				$rootScope.auth.$logout();
			};
		}
	}
});