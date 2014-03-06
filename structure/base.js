

/**
 * Firebase connections
 */
FIREBASE = "https://mennyiazannyi.firebaseio.com/";

db$ = new Firebase(FIREBASE);



/**
 * Models
 */



/**
 * Ractive settings
 */
Ractive.defaults.debug = true;


/**
 * The root of all components
 */
Component = Ractive.extend({
});