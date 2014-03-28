angular.module("app.page", [
  "app.navbar"
  "app.transactions"
  "app.intro"
  "app.footer"
])

.directive "page", ->
  restrict: "E"
  templateUrl: "page"
  controller: ($scope) ->



