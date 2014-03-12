/*
 * Settings
 */

/**
 * Firebase address
 */
FIREBASE = "https://mennyiazannyi.firebaseio.com/";

/**
 * Globally accessible variables
 */
GLOBALS = [
           't',
           'amt'
           ];


/* ----------------- End of settings ---------------- */


/**
 * Firebase connections
 */

dbRef = new Firebase(FIREBASE);
usersRef = dbRef.child("users");

var app = angular.module("app", ["firebase"]);


/**
 * template url
 */
function tmpl(name) {
	return "components/"+name+"/"+name+".html";
}

