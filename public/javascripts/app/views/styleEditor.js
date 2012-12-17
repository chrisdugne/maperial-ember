(function( app ) {
	'use strict';

	var StyleEditorView = Ember.View.extend({
		templateName: 'styleEditor',
		didInsertElement: function(){
			app.StyleEditorController.renderUI();
		},
		willDestroyElement: function(){
			app.StyleEditorController.cleanUI();
		}
	});
	
	app.StyleEditorView = StyleEditorView;

})( window.Webapp);

