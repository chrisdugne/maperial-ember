(function( app ) {
	'use strict';

	var ColorbarsView = Ember.View.extend({
		templateName: 'colorbars',
		didInsertElement: function(){
			app.ColorbarsController.renderUI();
		},
		willDestroyElement: function(){
			app.ColorbarsController.cleanUI();
		}
	});
	
	app.ColorbarsView = ColorbarsView;

})( window.Webapp);
