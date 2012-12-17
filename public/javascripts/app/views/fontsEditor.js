(function( app ) {
	'use strict';

	var FontsEditorView = Ember.View.extend({
		templateName: 'fontsEditor',
		didInsertElement: function(){
			app.FontsEditorController.renderUI();
		},
		willDestroyElement: function(){
			app.FontsEditorController.cleanUI();
		}
	});
	
	app.FontsEditorView = FontsEditorView;

})( window.Webapp);
