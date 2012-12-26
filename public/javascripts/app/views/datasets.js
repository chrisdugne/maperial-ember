(function( app ) {
	'use strict';

	var DatasetsView = Ember.View.extend({
		templateName: 'datasets',
		didInsertElement: function(){
			app.DatasetsController.renderUI();
		},
		willDestroyElement: function(){
			app.DatasetsController.cleanUI();
		}
	});
	
	app.DatasetsView = DatasetsView;

})( window.Webapp);