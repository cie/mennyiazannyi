MY_ACCOUNT = "Me"

angular.module("app.transactions", [
  "app.transaction"
])

# Tell if an account is owned by the user.
.factory "myAccount", ->
  (acctName) ->
    return false  unless acctName
    acctName = acctName.toLowerCase()
    return true  if acctName is MY_ACCOUNT.toLowerCase()
    for lang of TRANSLATIONS
      translation = TRANSLATIONS[lang][MY_ACCOUNT]
      return true  if translation and translation.toLowerCase() is acctName
    false

.directive "transactions", ->
  restrict: "E"
  templateUrl: tmpl("transactions")
  link: (scope, element, attrs) ->
    element.children().first().unwrap()
    scope.element = element
    return

  controller: ($scope, $firebase, $rootScope,
               myAccount, $timeout, updateIndex, compileExpression) ->
    $rootScope.$watch "expression", (expression) ->
      $scope.transactions = _.filter(
        $rootScope.user.transactions, compileExpression(expression)
      )
      return

    $scope.selectTransaction = (tr) ->
      if $scope.activeTransaction
        $scope.activeTransaction.active = false
      tr.active = true
      $scope.activeTransaction = tr
      return

    $scope.newTransaction =
      date: new Date().toISOString().substring(0, 10)
      from: ""
      to: ""
      sum: ""
      currency: $rootScope.currency
      text: ""
      categories: ""

    $rootScope.$watch "currency", (currency) ->
      # if no sum entered
      unless +$scope.newTransaction.sum
        $scope.newTransaction.currency = currency

    $scope.addTransaction = ->
      t = $scope.newTransaction
      updateIndex t
      
      # enable decimal comma, avoid NaNs
      $scope.user.$child("transactions").$add(
        date: t.date
        from: t.from
        to: t.to
        sum: +("" + t.sum).replace(",", ".") or 0
        currency: t.currency
        text: t.text
        categories: t.categories
      ).then (id) ->
        
        # select new transaction
        $timeout (->
          $scope.activeTransaction = id.name()
          return
        ), 0
        return

      
      # keep date as it is
      #this.set('newTransaction.date', new Date().toDateString());
      $scope.newTransaction.from = ""  unless myAccount(t.from)
      $scope.newTransaction.to = ""  unless myAccount(t.to)
      $scope.newTransaction.sum = ""
      $scope.newTransaction.currency = $rootScope.currency
      $scope.newTransaction.text = ""
      $scope.newTransaction.categories = ""
      
      # focus first item in new row
      $("table>tfoot>tr input", $scope.element).first().focus()
      return

    $scope.deleteTransaction = (tr) ->
      tr.deleted = true
      return

    $scope.restoreTransaction = (tr) ->
      tr.deleted = false
      return

    return

