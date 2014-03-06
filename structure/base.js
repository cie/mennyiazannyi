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
           't'
           ];


/* ----------------- End of settings ---------------- */


/**
 * Firebase connections
 */

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
	
	adaptors: [ 'Backbone' ],
	
	init: function() {
		var _this = this; 
		afterwards(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // introduce these only if not the top level component 
	        if (_this !== page) {
	          pullers = {};
	          pushers = {};
	          _this.pushDisabled = true;
	          
	          for (_i = 0, _len = GLOBALS.length; _i < _len; _i++) {
	            variable = GLOBALS[_i];
	            pullers[variable] = (function(variable) {
	              return function(newValue) {
	                _this.pushDisabled = true;
	                _this.set(variable, newValue);
	                _this.pushDisabled = false;
	              };
	            })(variable);
	            pushers[variable] = (function(variable) {
	              return function(newValue) {
	                if (!_this.pushDisabled) {
	                  page.set(variable, newValue);
	                }
	              };
	            })(variable);
	          }
	          pullerObserver = page.observe(pullers);
	          _this.observe(pushers);
	          _this.pushDisabled = false;
	          return _this.on("teardown", function() {
	            return pullerObserver.cancel();
	          });
	        }
	      });
	}
});

/*
 * Helpers
 */

/**
 * Schedules a function
 */
function afterwards(fn) {
	setTimeout(fn, 0);
}