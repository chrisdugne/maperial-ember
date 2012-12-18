(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		uid: "",
		email: "",
		name: "",
		maps: Ember.Array,
		styles: Ember.Array,
		datasets: Ember.Array,
		colorbars: Ember.Array,
		fonts: Ember.Array,
		icons: Ember.Array,
		loggedIn: false
	});
	
	app.user = User.create();
	
})( window.Webapp);
