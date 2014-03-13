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
 * template url
 */
function tmpl(name) {
	return "components/"+name+"/"+name+".html";
}

