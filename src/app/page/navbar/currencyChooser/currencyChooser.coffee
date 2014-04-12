CURRENCIES =
  EUR:
    sign: "€"
    value: 1
    name: "Euro"
    precision: 2
    format: (x) ->
      "€ " + x.toFixed(2)

  HUF:
    sign: "Ft"
    value: 1 / 306
    name: "Hungarian Forint"
    precision: 0
    format: (x) ->
      x.toFixed(0) + " Ft"
    postfix: true

  USD:
    sign: "$"
    value: 1 / 1.39
    name: "U.S. Dollar"
    precision: 2
    format: (x) ->
      "$ " + x.toFixed(2)

  GBP:
    sign: "£"
    value: 1/0.83
    name: "British Pound"
    precision: 2
    format: (x) ->
      "£ " + x.toFixed(2)

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

  templateUrl: "currencyChooser"
  controller: ($scope, $rootScope) ->
    $scope.currencies = CURRENCIES
    $scope.chooseCurrency = (currency) ->
      $rootScope.currency = currency


