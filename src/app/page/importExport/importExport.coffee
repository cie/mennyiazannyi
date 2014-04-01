angular.module("app.importExport", [])

.directive "importExport", ->
  restrict: "E"
  templateUrl: "importExport"
  link: (scope, element, attr) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope, $sce, $modal, $timeout) ->
    csv = ->
      transactions = _.filter $rootScope.user.transactions, $rootScope.filter

      fields = [
        "date"
        "from"
        "to"
        "sum"
        "currency"
        "text"
        "categories"
      ]
      quote = (s)->"\"#{ (""+s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') }\""

      header = _.map(fields, $rootScope.t).join(",")
      table = _.map(transactions, (tr)->
        _.map(fields, (f)-> quote(tr[f])).join(",")
      ).join("\n")

      header + "\n" + table

    $scope.export = ->
      win = $modal.open(
        windowClass: "exportDialog"
        templateUrl: "exportDialog"
        resolve:
          exported: csv
        controller: ($scope, $modalInstance, exported) ->
          $scope.exported = exported
          $scope.close = $modalInstance.close
          $scope.selectAll = (e)->
            e.target.select()
      )
      win.opened.then ->
        $timeout ->
          $(".exportDialog textarea").focus()[0].select()
        , 0


      


    ###
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
    ###
