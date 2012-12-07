(function( app ) {
	'use strict';

	var StyleEditorView = Ember.View.extend({
		templateName: 'styleEditor',
		didInsertElement: function(){
			renderStyleEditorUI();
		},
		willDestroyElement: function(){
			cleanStyleEditorUI();
		}
	});
	
	app.StyleEditorView = StyleEditorView;

})( window.Webapp);

