
getLang = ->
  
  # try to find out the user's language
  lang = navigator.language or navigator.userLanguage
  m = lang.match(/([a-z]+)(-[A-Z]+)?/)
  return m[1]  if TRANSLATIONS[m[1]]  if m
  
  # default to English
  "en"
TRANSLATIONS =
  hu:
    Hello: "Helló"
    "Log in": "Bejelentkezés"
    "Log in with": "Bejelentkezés"
    transactions: "Tranzakciók"
    budget: "Büdzsé"
    flow: "Pénzfolyam"
    love: "Szeretet"
    Language: "Nyelv"
    "Query help": "Segítség a lekérdezésekhez"
    "Log out": "Kijelentkezés"
    Settings: "Beállítások"
    "Nothing special here yet :)": "Még nincs itt semmi érdekes :)"
    Date: "Dátum"
    From: "Kitől"
    To: "Kinek"
    Sum: "Összeg"
    Currency: "Pénznem"
    Text: "Szöveg"
    Comment: "Megjegyzés"
    Categories: "Kategóriák"
    "Hungarian Forint": "Forint"
    Euro: "Euró"
    "U.S. Dollar": "USA Dollár"
    Me: "Én"
    LAST: ""

  en:
    transactions: "Transactions"
    budget: "Budget"
    flow: "Money flow"
    love: "Love"
    "Query help": "Help for queries"
    LAST: ""

LANGS =
  hu:
    flag: "hu"
    name: "Magyar"

  en:
    flag: "gb"
    name: "English"

angular.module("app.languageSelector", [])

.run ($rootScope) ->
  $rootScope.lang = getLang()
  $rootScope.t = (term) ->
    TRANSLATIONS[$rootScope.lang][term] or term

.directive "languageSelector", ->
  restrict: "E"
  templateUrl: "languageSelector"
  link: (scope, element, attr) ->
    element.children().first().unwrap()

  controller: ($scope, $rootScope) ->
    $scope.langs = LANGS
    $scope.selectLanguage = (lang) ->
      $rootScope.lang = lang

