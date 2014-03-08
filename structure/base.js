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
users$ = db$.child("users");



/**
 * Router
 */

Router = Backbone.Router.extend({
	routes: {
	}
});
router = new Router();


/**
 * Ractive settings
 */
Ractive.defaults.debug = true;


/**
 * The root of all components
 */
Component = Ractive.extend({
	
	init: function() {
		var _this = this; 
		afterwards(function() {
	        var pullerObserver, pullers, pushers, variable, _i, _len;
	        
	        // calculate globals from global and local list of globals
	        var globals = GLOBALS.slice(0);
	        if (this.globals) {
	        	globals = globals.concat(this.globals);
	        }
	        
	        // introduce these only if not the top level component 
	        if (_this !== page) {
	          pullers = {};
	          pushers = {};
	          _this.pushDisabled = true;
	          
	          for (_i = 0, _len = globals.length; _i < _len; _i++) {
	            variable = globals[_i];
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