(function( app ) {
	'use strict';

	var StylesView = Ember.View.extend({
		templateName: 'styles',
		didInsertElement: function(){
			app.StylesController.renderUI();
		},
		willDestroyElement: function(){
			app.StylesController.cleanUI();
		}
	});
	
	app.StylesView = StylesView;

})( window.Webapp);

