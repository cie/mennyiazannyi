/*
 * Settings
 */

/**
 * Firebase address
 */
FIREBASE = "https://mennyiazannyi.firebaseio.com/";



/* ----------------- End of settings ---------------- */


/**
 * Firebase connections
 */

dbRef = new Firebase(FIREBASE);
usersRef = dbRef.child("users");

/**
 * the app
 */
var app = angular.module("app", ["firebase"]);


/**
 * filters
 */
app.filter("map", function() {
	return function(collection, mapping) {
		if (!mapping) mapping = function(x) {return x}
		return _.map(collection, mapping);
	}
});
app.filter("toArray", function() {
	return function(collection) {
		return _.toArray(collection);
	}
});


/**
 * directives
 */
app.directive("onEnter", function() {
	return {
		scope: {
			onEnter: "&"
		},
		link: function(scope, element, attrs) {
			element.on("keypress", function(e) {
				if (e.which == 13) {
					scope.$apply(function(){
						scope.onEnter();
					});
				}
			});
		}
	}
});

/**
 * template url
 */
function tmpl(name) {
	return "components/"+name+"/"+name+".html";
}

