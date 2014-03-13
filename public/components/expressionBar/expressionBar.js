app.run(function($rootScope){
	$rootScope.expression = "all";
});

app.directive("expressionBar", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("expressionBar"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
		},
		controller: function($scope) {
		}
	}
});