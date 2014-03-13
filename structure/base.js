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

/**
 * template url
 */
function tmpl(name) {
	return "components/"+name+"/"+name+".html";
}

