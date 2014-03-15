app.run(function($rootScope){
	$rootScope.expression = "all";
});

app.factory("compileExpression", function(updateIndex) {
    return function(expr) {
        // this is too complex now...
        /*clauses = expr.split(";").map(function(clause){
            var terms = clause.split(',').map(function(term) {
                if (term.charAt(0) === '-') {
                    term = term.substr(1);
                    return [term, false];
                }
                return [term, true];
            });
        });*/

        // just hacking it in regxy:)

        // not
        expr = expr.replace(/(^|[,;(])-/g, "$1!");
        // or
        expr = expr.replace(/;/g, "||");
        // and
        expr = expr.replace(/,/g, "&&");
        // clean <<>>s
        expr = expr.replace(/<<|>>/g, "");
        // terms in <<>>s
        expr = expr.replace(/([^|&!()]+)/g, "<<$1>>");
        // dates
        expr = expr.replace(/<<([0-9]{4})>>/g, "y.apply(tr,[$1])");
        expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})>>/g, "ym.apply(tr,[$1,$2])");
        expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})>>/g, "ymd.apply(tr,[$1,$2,$3])");
        // finalize terms (first remove quotes and backslashes)
        expr = expr.replace(/["\\]/g, "");

        expr = expr.replace(/<<(.*?)>>/g, function(match, term) {
			term = updateIndex.sanitize(term);
			term = term.replace(/[\\"]/g, "");
			return "tr.keywords[\"" + term + "\"]";
		});

        function y(year) {
            return this.date.getFullYear() == year;
        }
        function ym(year, month) {
            var d = this.date;
            return d.getFullYear() == year && d.getMonth()+1 == month;
        }
        function ymd(year, month, day) {
            var d = this.date;
            return d.getFullYear() == year && d.getMonth()+1 == month && d.getDate() == day;
        }
            
        return eval("(function(tr){return " + expr + "})");
    }
});

app.directive("expressionBar", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("expressionBar"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
		},
		controller: function($scope, $rootScope) {
			$scope.localExpression = $rootScope.expression;

			$scope.updateExpression = function() {
				$rootScope.expression = $scope.localExpression;
			}
			$scope.revertExpression = function() {
				$scope.localExpression = $rootScope.expression;
			}
		}
	}
});
