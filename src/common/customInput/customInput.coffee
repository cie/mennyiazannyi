angular.module("customInput", [
])

.directive("customInput", ->
  restrict: "EA"
  link: (scope, element, attr) ->
    element.on "mousedown", (e)->
      if e.target.tagName isnt "INPUT"
        $("input", element).focus()[0].select()
        false
    $("input", element).on "focus", ->
      element.addClass("focus")
    $("input", element).on "blur", ->
      element.removeClass("focus")


    
)
