
app.directive("navbar", function(){
	return {
		restrict: "E",
		scope: {},
		templateUrl: tmpl("navbar"),
		controller: function($scope) {
			$scope.tabs = {
				transactions: {icon:"transfer"},
				budget: {icon:"briefcase"},
				flow: {icon:"stats"},
				love: {icon:"heart-empty"}
			};
		}
	}
});