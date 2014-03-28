angular.module("app.expressionBar",[])

.run ($rootScope) ->
  $rootScope.expression = "all"
  return

.factory "compileExpression", (updateIndex) ->
  (expr) ->
    
    # this is too complex now...
    #clauses = expr.split(";").map(function(clause){
    #            var terms = clause.split(',').map(function(term) {
    #                if (term.charAt(0) === '-') {
    #                    term = term.substr(1);
    #                    return [term, false];
    #                }
    #                return [term, true];
    #            });
    #        });
    
    # just hacking it in regxy:)
    
    # not
    
    # or
    
    # and
    
    # remove spaces around parentheses
    
    # clean <<>>s
    
    # terms in <<>>s
    
    # dates
    
    # finalize terms (first remove quotes and backslashes)
    expr = expr.replace(/(^|[,;(])\s*-/g, "$1!")
    expr = expr.replace(/\s*;\s*/g, "||")
    expr = expr.replace(/\s*,\s*/g, "&&")
    expr = expr.replace(/\(\s*/g, "(")
    expr = expr.replace(/\s*\)/g, ")")
    expr = expr.replace(/<<|>>/g, "")
    expr = expr.replace(/([^|&!()]+)/g, "<<$1>>")
    expr = expr.replace(/["\\]/g, "")
    expr = expr.replace(/<<(.*?)>>/g, (match, term) ->
      term = updateIndex.sanitize(term)
      term = term.replace(/[\\"]/g, "")
      "tr.keywords[\"" + term + "\"]"
    )
    console.log expr
    eval "(function(tr){" +
      "if (updateIndex.outdated(tr)) { updateIndex(tr) } " +
      "return " + expr +
      "})"

.directive "expressionBar", (compileExpression) ->
  restrict: "E"
  templateUrl: "expressionBar"
  link: (scope, element, attrs) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope) ->
    $scope.localExpression = $rootScope.expression
    $scope.updateExpression = ->
      expr = $rootScope.expression = $scope.localExpression

    $scope.revertExpression = ->
      $scope.localExpression = $rootScope.expression

    $rootScope.$watch "expression", (expression) ->
      $rootScope.filter = compileExpression(expression)

