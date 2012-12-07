(function( app ) {
	'use strict';

	var HomeView = Ember.View.extend({
		templateName: 'home',
		didInsertElement: function(){
			renderHomeUI();
		},
		willDestroyElement: function(){
			cleanHomeUI();
		}
	});
	
	app.HomeView = HomeView;

})( window.Webapp);