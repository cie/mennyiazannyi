CURRENCIES =
  EUR:
    sign: "€"
    value: 1
    name: "Euro"
    format: (x) ->
      "€ " + x.toFixed(2)

  HUF:
    sign: "Ft"
    value: 1 / 309
    name: "Hungarian Forint"
    format: (x) ->
      x.toFixed(0) + " Ft"

  USD:
    sign: "$"
    value: 1 / 1.39
    name: "U.S. Dollar"
    format: (x) ->
      "$ " + x.toFixed(2)

angular.module("app.currencyChooser",[])

# redefine currency filter
.filter "currency", ($rootScope) ->
  (amount) ->
    "<currency> " + $rootScope.currency

.run ($rootScope) ->
  
  # default to HUF
  $rootScope.currency = "HUF"
  return

.directive "currencyChooser", ->
  restrict: "E"
  link: (scope, element, attr) ->
    element.children().first().unwrap()
    return

  templateUrl: "currencyChooser"
  controller: ($scope, $rootScope) ->
    $scope.currencies = CURRENCIES
    $scope.chooseCurrency = (currency) ->
      $rootScope.currency = currency
      return

    return


