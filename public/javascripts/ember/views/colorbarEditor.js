(function( app ) {
	'use strict';

	var ColorbarEditorView = Ember.View.extend({
		templateName: 'colorbarEditor',
		didInsertElement: function(){
			renderColorbarEditorUI();
		},
		willDestroyElement: function(){
			cleanColorbarEditorUI();
		}
	});
	
	app.ColorbarEditorView = ColorbarEditorView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderColorbarEditorUI()
{
	
}

function cleanColorbarEditorUI()
{
	
}
