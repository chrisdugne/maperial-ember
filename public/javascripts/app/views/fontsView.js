(function( app ) {
	'use strict';

	var FontsView = Ember.View.extend({
		templateName: 'fonts',
		didInsertElement: function(){
			app.FontsController.renderUI();
		},
		willDestroyElement: function(){
			app.FontsController.cleanUI();
		}
	});
	
	app.FontsView = FontsView;

})( window.Webapp);
