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

  controller: ($scope, $rootScope, $timeout, $filter,
               getKeywords, updateIndex) ->
    $scope.tags = []

    $scope.getColor = (tag) ->
      tag

    $scope.getTagClass = (tag) ->
      "tag-"+tag.replace(/[ ]/g , "_")

    $scope.typeahead = (query) ->
      query = updateIndex.sanitize(query)
      _.filter($rootScope.allKeywords, (k)->k.indexOf(query) != -1)
      
    updateAllKeywords = () ->
      if $rootScope.user and $rootScope.user.transactions
        # XXX can optimize by not creating this array
        transactions = _.toArray($rootScope.user.transactions)
        $rootScope.allKeywords = getKeywords(transactions)
      else
        $rootScope.allKeywords = []
    $rootScope.$watch("user", updateAllKeywords)
    $rootScope.$watch("user.transactions", updateAllKeywords)

    $scope.$watch "tags.join(';')", (expression) ->
      if !expression
        expression = "all"
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
      switch event.which
        when 27 # esc
          $scope.newTag = ""
        when 8 # bksp
          if $scope.newTag is ""
            $scope.tags.pop()
        when 13 # enter
          if $scope.newTag isnt ""
            $scope.tags.push($scope.newTag)
            $scope.newTag = ""



      
    $scope.focus = () ->
      $timeout ->
        $(".tagsinput", $scope.element).focus()
      ,0


