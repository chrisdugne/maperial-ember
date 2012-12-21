(function( app ) {
	'use strict';

	var ColorbarEditorView = Ember.View.extend({
		templateName: 'colorbarEditor',
		didInsertElement: function(){
			app.ColorbarEditorController.renderUI();
		},
		willDestroyElement: function(){
			app.ColorbarEditorController.cleanUI();
		}
	});
	
	app.ColorbarEditorView = ColorbarEditorView;

})( window.Webapp);
