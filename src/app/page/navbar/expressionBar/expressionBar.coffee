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
    scope.element = element.first() # XXX only one root-level tag is allowed
    scope.element.unwrap() # unwrap for correct bootstrap styling
    scope.input = $(".tagsinput", scope.element)

  controller: ($scope, $rootScope, $timeout) ->
    $scope.tags = []

    $scope.getColor = (tag) ->
      tag

    $scope.getTagClass = (tag) ->
      "tag-"+tag.replace(/[ ]/g , "_")

    $scope.typeahead = (query) ->
      return [query, "-"+query]

    $scope.$watch "tags.join(';')", (expression) ->
      $rootScope.filter = compileExpression(expression)

    $scope.addTag = ->
      newTag = $scope.newTag
      tags = $scope.tags

      i = _.indexOf(tags, newTag)
      if i<0
        tags.push($scope.newTag)
        $scope.newTag = ""
      else
        $timeout ->
          $("."+$scope.getTagClass(newTag), $scope.element).hide().fadeIn()
          $scope.newTag = ""

    $scope.removeTag = (t) ->
      $scope.tags = _.without($scope.tags, t)
      $scope.focus()

    $scope.click = (event) ->
      $scope.focus()

    $scope.keydown = (event) ->
      if event.which is 27 # esc
        $scope.newTag = ""
      if event.which is 8 # bksp
        if $scope.newTag is ""
          $scope.tags.pop()


      
    $scope.focus = () ->
      $timeout ->
        $(".tagsinput", $scope.element).focus()
      ,0


