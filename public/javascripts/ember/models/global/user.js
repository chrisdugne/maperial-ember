(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		email: "",
		name: "",
		loggedIn: false
	});
	
	app.user = User.create();
	
})( window.Webapp);
