VERSES = "1Tim6:17-19":
  hu: "Azoknak pedig, akik e világban gazdagok, parancsold meg,
       hogy ne legyenek gőgösek, és ne a bizonytalan
       gazdagságban reménykedjenek, hanem Istenben, aki
       megélhetésünkre mindent bőségesen megad nekünk.
       A gazdagok tegyenek jót, legyenek gazdagok a jó
       cselekedetekben, adakozzanak szívesen, javaikat
       osszák meg másokkal, gyűjtsenek maguknak jó alapot
       a jövendőre, hogy elnyerjék az igazi életet. (1 Tim 6:17–19 BT)"
  en: "Instruct those who are rich in this present world
       not to be conceited or to fix their hope on the
       uncertainty of riches, but on God, who richly
       supplies us with all things to enjoy. Instruct
       them to do good, to be rich in good works, to be
       generous and ready to share, storing up for
       themselves the treasure of a good foundation
       for the future, so that they may take hold of
       that which is life indeed. (1 Tim 6:17—19 NASB)"

angular.module("app.footer", [])
  
  
.directive "footer", ->
  restrict: "E"
  templateUrl: tmpl("footer")
  controller: ($scope) ->
    
    # choose a random verse
    verses = _.toArray(VERSES)
    $scope.verse = verses[_.random(0, verses.length - 1)]
    return

