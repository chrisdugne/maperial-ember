(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		email: "",
		name: "out",
		loggedIn: false,
		debug: false
	});
	
	app.user = User.create();
	console.log("created a user : " + app.user.name);
})( window.Webapp);
