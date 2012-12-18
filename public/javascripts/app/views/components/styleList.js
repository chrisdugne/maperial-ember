(function( app ) {
	'use strict';

	app.MyStylesController = Ember.ObjectController.extend({});
	app.MyStylesView = Ember.View.extend({
		templateName: 'styleList'
	});
	
	app.PublicStylesController = Ember.ObjectController.extend({});
	app.PublicStylesView = Ember.View.extend({
		templateName: 'styleList'
	});

})( window.Webapp);
