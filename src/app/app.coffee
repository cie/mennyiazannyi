FIREBASE = "https://mennyiazannyi.firebaseio.com/"
dbRef = new Firebase(FIREBASE)
usersRef = dbRef.child("users")


angular.module("app", [
  "firebase"
  "app.page"
])


.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise('/')

.factory "tmpl", ->
  (name) ->
    "components/" + name + "/" + name + ".html"


.filter "map", ->
  (collection, mapping) ->
    unless mapping
      mapping = (x) ->
        x
    _.map collection, mapping

.filter "toArray", ->
  (collection) ->
    _.toArray collection

.directive "specialKeys", ->
  scope:
    onEnter: "&"
    onEsc: "&"

  link: (scope, element, attrs) ->
    element.on "keydown", (e) ->
      if e.which is 13
        scope.$apply ->
          scope.onEnter()

      if e.which is 27
        scope.$apply ->
          scope.onEsc()

