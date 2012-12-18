(function( app ) {
	'use strict';

	var HomeView = Ember.View.extend({
		templateName: 'home',
		didInsertElement: function(){
			app.HomeController.renderUI();
		},
		willDestroyElement: function(){
			app.HomeController.cleanUI();
		}
	});
	
	app.HomeView = HomeView;

})( window.Webapp);