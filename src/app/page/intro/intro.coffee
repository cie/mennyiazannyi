angular.module("app.intro",[])

.directive "intro", ->
  restrict: "EA"
  templateUrl: tmpl("intro")
  link: (scope, element, attr) ->
    element.children().first().unwrap()
    return

  controller: ($scope) ->

