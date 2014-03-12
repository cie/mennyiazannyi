
app.directive("page", function(){
	return {
		restrict: "E",
		scope: {},
		templateUrl: tmpl("page"),
		controller: function($scope) {
			$scope.tab = "transactions";
		}
	};
});

