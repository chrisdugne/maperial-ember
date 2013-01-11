(function( app ) {
	'use strict';

	var MapCreationView = Ember.View.extend({
		templateName: 'mapCreation',
		didInsertElement: function(){
			app.MapCreationController.renderUI();
		},
		willDestroyElement: function(){
			app.MapCreationController.cleanUI();
		}
	});
	
	app.MapCreationView = MapCreationView;

})( window.Webapp);

