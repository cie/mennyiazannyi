angular.module("app.userAccount", [])

.directive "userAccount", ->
  restrict: "EA"
  templateUrl: tmpl("userAccount")
  link: (scope, element, attr) ->
    element.children().first().unwrap()
    return

  controller: ($scope, $rootScope, $firebase, $firebaseSimpleLogin) ->
    $rootScope.auth = $firebaseSimpleLogin(dbRef)
    $rootScope.$watch "auth.user", (user, oldValue) ->
      if user
        userNode = $firebase(usersRef.child(user.uid))
        userNode.$update registered: true
        userNode.$bind $rootScope, "user"
      else
        $rootScope.user = undefined
      return

    $scope.login = (provider) ->
      $rootScope.auth.$login provider
      return

    $scope.logout = ->
      $rootScope.auth.$logout()
      return

    return

