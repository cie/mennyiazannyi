

LANGS =
  hu:
    flag: "hu"
    name: "Magyar"

  en:
    flag: "gb"
    name: "English"

angular.module("app.languageSelector", [
  "ngCookies"
  ])

.factory("getLang", ($cookies)->
  ->
    lang = $cookies.lang

    unless lang
      # try to find out the user's language
      lang = navigator.language or navigator.userLanguage
      m = lang.match(/([a-z]+)(-[A-Z]+)?/)
      return m[1]  if m and LANGS[m[1]]
    
      # default to English
      return "en"
    lang
)


.run ($rootScope, gettextCatalog, getLang) ->
  $rootScope.lang = gettextCatalog.currentLanguage = getLang()

.directive "languageSelector", ->
  restrict: "E"
  templateUrl: "languageSelector"
  link: (scope, element, attr) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope, gettextCatalog, $cookies) ->
    $scope.langs = LANGS
    $scope.selectLanguage = (lang) ->
      $cookies.lang = $rootScope.lang = gettextCatalog.currentLanguage = lang
    $scope.currentLang = () ->
      gettextCatalog.currentLanguage

