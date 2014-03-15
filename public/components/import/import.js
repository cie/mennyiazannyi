app.directive("import", function() {
	return {
		restrict : "E",
		templateUrl : tmpl("import"),
		link : function(scope, element, attr) {
			element.children().first().unwrap();
		},
		controller : function($scope, $rootScope, $sce) {
			$.ajax("import/import.min.js", {
				dataType : "text",
				success : function(data) {
					$scope.$apply(function() {
						$scope.bookmarklet = $sce.trustAsHtml($("<a>").attr("href", data).text(
								$rootScope.t("Export transactions")).appendTo("<span>")
								.parent().html());
					});
				}
			});

			$scope.csv = "Hello";

			$scope.import = function() {
				var csv = $scope.csv;
				var lines = csv.split("\n");
				var fields = lines.splice(0, 1)[0].split(",");
				var transactions = _.map(lines, function(l) {
					var values = JSON.parse("[" + l + "]");
					var record = {}
					_.each(fields, function(f, i) {
						record[f] = values[i];
					});
					return record;
				});
				console.log(transactions);
			}
		}
	}
});