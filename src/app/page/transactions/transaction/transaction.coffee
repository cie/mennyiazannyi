
angular.module("app.transaction", [
])

.factory "updateIndex", ->
  updateIndex = (tr) ->
    # save date as number
    tr.$priority = +new Date(tr.date)

    # no keywords for deleted
    if tr.deleted
      tr.keywords = {deleted: true}
      tr.indexVersion = VERSION
      return
    
    
    # index keywords
    keywords = [
      tr.from
      tr.to
      tr.currency
      tr.text
    ]
    kws = {}
    keywords = keywords.concat(tr.categories.split(","))  if tr.categories
    _.each keywords, (s) ->
      return  unless s
      s = updateIndex.sanitize(s)
      return  unless s
      kws[s] = true
      
      # add type: tag
      m = undefined
      if m = s.match(/^([^:]+):(.*)$/)
        kws[m[1]] = true
        kws[m[2]] = true
      return

    
    # add from:... fields
    _.each [
      "from"
      "to"
      "currency"
      "text"
      "sum"
    ], (field) ->
      s = updateIndex.sanitize(tr[field])
      if s
        kws[field + ":" + s] = true
        
        # XXX first-word only
        kws[field + ":" + s.split(" ")[0]] = true
      return

    kws.all = true
    tr.keywords = kws
    tr.indexVersion = VERSION
    return
  VERSION = 13
  updateIndex.sanitize = (s) ->
    
    # convert to string
    s = "" + s
    
    # trim
    s = s.trim()
    
    # lower case
    s = s.toLowerCase()
    
    # sane whitespaces
    s = s.replace(/\s+/g, " ")
    
    # no .#$/[] a la Firebase
    s = s.replace(/[.#$\/\[\]]/g, "")
    
    # remove space after :
    s = s.replace(/:\s+/g, ":")
    s

  updateIndex.outdated = (tr) ->
    not tr.indexVersion or tr.indexVersion < VERSION

  updateIndex

.factory "getKeywords", ->
  (transactions) ->
    keywords = {}

    for tr in transactions
      for k of tr.keywords
        # XXX hack: skip these from search (no need)
        unless k.match /^(to|from|text|sum):/
          keywords[k] = true

    result = []
    for k of keywords
      result.push(k)

    result


.directive "transaction", ->
  restrict: "A"
  scope:
    value: "=?value"
    onFocus: "&onFocus"

  transclude: true
  templateUrl: "transaction"
  link: (scope, element, attr) ->
    scope.element = element
    if scope.onFocus
      element.on "focus", "input", ->
        scope.$apply scope.onFocus
        return

    return

  controller: ($rootScope, $scope, myAccount, updateIndex, $timeout) ->
    $scope.myAccount = myAccount
    $scope.updateIndex = updateIndex
    $scope.$watch "''+value.from+'()'+value.to+'()'+value.deleted", ->
      tr = $scope.value
      fromMe = myAccount(tr.from)
      toMe = myAccount(tr.to)
      $scope.element.toggleClass "expense", fromMe and not toMe
      $scope.element.toggleClass "income", toMe and not fromMe
      $scope.element.toggleClass "external", not fromMe and not toMe
      $scope.element.toggleClass "internal", fromMe and toMe
      $scope.element.toggleClass "deleted", !!tr.deleted
      return

    $scope.$watch "value.active", (value) ->
      $scope.element.toggleClass "active", !!value
      return

    return


