
getLang = ->
  #lang = $.cookie("lang")

  unless lang
    # try to find out the user's language
    lang = navigator.language or navigator.userLanguage
    m = lang.match(/([a-z]+)(-[A-Z]+)?/)
    return m[1]  if m and LANGS[m[1]]
  
    # default to English
    return "en"
  lang


LANGS =
  hu:
    flag: "hu"
    name: "Magyar"

  en:
    flag: "gb"
    name: "English"

angular.module("app.languageSelector", [])

.run ($rootScope, gettextCatalog) ->
  $rootScope.lang = gettextCatalog.currentLanguage = getLang()

.directive "languageSelector", ->
  restrict: "E"
  templateUrl: "languageSelector"
  link: (scope, element, attr) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope, gettextCatalog) ->
    $scope.langs = LANGS
    $scope.selectLanguage = (lang) ->
      $rootScope.lang = gettextCatalog.currentLanguage = lang
    $scope.currentLang = () ->
      gettextCatalog.currentLanguage

