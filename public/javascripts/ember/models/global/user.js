(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		email: "",
		name: "out",
		loggedIn: false,
		debug: false
	});
	
	app.user = User.create();
	
})( window.Webapp);
