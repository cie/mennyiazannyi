angular.module("app.page", [
  "app.navbar"
  "app.transactions"
  "app.intro"
])

.directive "page", ->
  restrict: "E"
  templateUrl: "page"
  controller: ($scope) ->



