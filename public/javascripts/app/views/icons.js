(function( app ) {
	'use strict';

	var IconsView = Ember.View.extend({
		templateName: 'icons',
		didInsertElement: function(){
			app.IconsController.renderUI();
		},
		willDestroyElement: function(){
			app.IconsController.cleanUI();
		}
	});
	
	app.IconsView = IconsView;

})( window.Webapp);