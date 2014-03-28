angular.module("app.expressionBar",[
  "bootstrap-tagsinput"
])

.run ($rootScope) ->
  $rootScope.expression = "all"
  return

.factory "compileExpression", (updateIndex) ->
  (expr) ->
    
    
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
    eval "(function(tr){" +
      "if (updateIndex.outdated(tr)) { updateIndex(tr) } " +
      "return " + expr +
      "})"

.directive "expressionBar", (compileExpression) ->
  restrict: "E"
  templateUrl: "expressionBar"
  link: (scope, element, attrs) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope, $timeout) ->
    $scope.tags = []

    $scope.getTagClass = (tag) ->
      "tag-"+tag.replace(/[ ]/g , "_")

    $scope.typeahead = (query) ->
      return [query, "-"+query]

    $rootScope.$watch "expression", (expression) ->
      $rootScope.filter = compileExpression(expression)

    $scope.addTag = ->
      $scope.tags.push($scope.newTag)
      $scope.newTag = ""

    $scope.removeTag = (t) ->
      $scope.tags = _.without($scope.tags, t)
      $timeout ->
        $(".tagsinput").focus()
      ,0
      

