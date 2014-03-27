angular.module("navbar", [
  "app.currencyChooser"
  "app.expressionBar"
  "app.languageSelector"
  "app.userAccount"
])

.directive "navbar", ->
  restrict: "E"
  templateUrl: tmpl("navbar")
  controller: ($scope) ->
    $scope.tabs =
      transactions:
        icon: "transfer"

      budget:
        icon: "briefcase"

      flow:
        icon: "stats"

      love:
        icon: "heart-empty"

