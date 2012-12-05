(function( app ) {
	'use strict';

	var FontsEditorView = Ember.View.extend({
		templateName: 'fontsEditor',
		didInsertElement: function(){
			renderFontsEditorUI();
		},
		willDestroyElement: function(){
			cleanFontsEditorUI();
		}
	});
	
	app.FontsEditorView = FontsEditorView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderFontsEditorUI()
{
	
}

function cleanFontsEditorUI()
{
	
}
