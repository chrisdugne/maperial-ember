(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		uid: "",
		email: "",
		name: "",
		mapnifyToken: "",
		maps: Ember.A([]),
		styles: Ember.A([]),
		datasets: Ember.A([]),
		colorbars: Ember.A([]),
		fonts: Ember.A([]),
		icons: Ember.A([]),
		loggedIn: false
	});
	
	app.user = User.create();
	
})( window.Webapp);
