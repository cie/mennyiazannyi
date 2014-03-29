MY_ACCOUNT = "Me"
INITIAL_BATCH_SIZE = 10
BATCH_SIZE = 3


angular.module("app.transactions", [
  "app.transaction"
  "infinite-scroll"
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

.factory "getTransactions", ($rootScope) ->
  () ->
    if $rootScope.user and $rootScope.filter then _.filter(
      $rootScope.user.transactions, $rootScope.filter
    ) else []

.directive "transactions", ->
  restrict: "E"
  templateUrl: "transactions"
  link: (scope, element, attrs) ->
    element.children().first().unwrap()
    scope.element = element
    return

  controller: ($scope, $firebase, $rootScope,
               myAccount, $timeout, updateIndex,
               getTransactions, getKeywords) ->

    updateTransactions = ->
      $scope.allTransactions = getTransactions()
      $scope.transactions = $scope.allTransactions.slice(0, INITIAL_BATCH_SIZE)

    $rootScope.$watch "filter", updateTransactions
    $rootScope.$watch "user", updateTransactions

    $scope.loadMore = () ->
      n = $scope.transactions.length
      for i in [n...Math.min(n+BATCH_SIZE, $scope.allTransactions.length)]
        $scope.transactions.push($scope.allTransactions[i])


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

