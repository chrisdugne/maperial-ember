(function( app ) {
	'use strict';

	var Globals = Ember.Object.extend({
		isLocal: false,
		debug: false,
		googleClientId: false,
		apiKey: 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8',
		scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
	});
	
	app.globals = Globals.create();
	app.globals.isLocal = window.location.hostname == "localhost";
	
	if(app.globals.isLocal)
		app.globals.googleClientId = '643408271777.apps.googleusercontent.com';
	else
		app.globals.googleClientId = '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com';
	

	console.log("ee " + app.user.name);
	
})( window.Webapp);
