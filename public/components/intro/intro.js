app.directive("intro", function() {
	return {
		restrict: "EA",
		templateUrl: tmpl("intro"),
		link: function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller: function($scope) {
			
		}
	}
});