(function( app ) {
	'use strict';

	var HomeView = Ember.View.extend({
		templateName: 'home',
		didInsertElement: function(){
			app.HomeController.renderHomeUI();
		},
		willDestroyElement: function(){
			app.HomeController.cleanHomeUI();
		}
	});
	
	app.HomeView = HomeView;

})( window.Webapp);