
app.directive("page", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("page"),
		controller: function($scope) {
			$scope.tab = "transactions";
		}
	};
});

