app.run(function($rootScope){
	$rootScope.expression = "all";
});

parseExpression = function(expr) {
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

    expr = expr.toLowerCase();
    // not
    expr = expr.replace(/(^|[,;])-/g, "$1!");
    // or
    expr = expr.replace(/;/g, "||");
    // and
    expr = expr.replace(/,/g, "&&");
    // clean <<>>s
    expr = expr.replace(/<<|>>/g, "");
    // terms in <<>>s
    expr = expr.replace(/[^|&!]+/g, "<<$1>>");
    // dates
    expr = expr.replace(/<<([0-9]{4})>>/g, "y.apply(this,[$1])");
    expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})>>/g, "ym.apply(this,[$1,$2])");
    expr = expr.replace(/<<([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})>>/g, "ymd.apply(this,[$1,$2,$3])");
    // finalize terms (first remove quotes and backslashes)
    expr = expr.replace(/["\\]/g, "");
    expr = expr.replace(/<<(.*?)>>/g, "term(\"$1\")");

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
    function term(s) {
        return this.from == s || this.to == s || this.currency == s || this.categories.split(",").any(function(x){x.split()});
    }
        
    return eval("(function(){return" + expr + "})")
}

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
