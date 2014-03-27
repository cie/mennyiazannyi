angular.module("app.import", [])

.directive "import", ->
  restrict: "E"
  templateUrl: tmpl("import")
  link: (scope, element, attr) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope, $sce) ->
    $.ajax "import/import.min.js",
      dataType: "text"
      success: (data) ->
        $scope.$apply ->
          $scope.bookmarklet = $sce.trustAsHtml(
            $("<a>")
              .attr("href", data)
              .text($rootScope.t("Export transactions"))
              .appendTo("<span>").parent().html()
          )

    $scope.csv = "Hello"
    $scope.export = ->
      filter = $rootScope.filter
      transactions = $rootScope.user.transactions
      result = []
      _.each transactions, (tr) ->
        result.push tr  if filter(tr)

      json = js_beautify(JSON.stringify(result))
      console.log json
      window.open "data:text/json," + encodeURIComponent(json)

    $scope.import = ->
      csv = $scope.csv
      lines = csv.split("\n")
      fields = lines.splice(0, 1)[0].split(",")
      transactions = _.map(lines, (l) ->
        values = JSON.parse("[" + l + "]")
        record = {}
        _.each fields, (f, i) ->
          record[f] = values[i]

        record
      )
      _.each transactions, (tr) ->
        
        # XXX this should be in bookmarklet
        tr.date = tr.date.substr(0, 10)
        
        # XXX this also
        tr.text = tr.comment
        tr.comment = undefined
        $rootScope.user.$child("transactions").$add(tr).then ->
          
          # XXX HACK: avoid re-sorting on each addition
          location.reload()
