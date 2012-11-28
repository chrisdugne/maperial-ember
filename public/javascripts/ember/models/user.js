
var User = Ember.Object.extend({
	isLocal: function() {
		return window.location.hostname == "localhost";
	},
	loggedIn: false,
	debug: false
});
