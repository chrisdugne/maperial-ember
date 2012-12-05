(function( app ) {
	'use strict';

	var IconsEditorView = Ember.View.extend({
		templateName: 'iconsEditor',
		didInsertElement: function(){
			renderIconsEditorUI();
		},
		willDestroyElement: function(){
			cleanIconsEditorUI();
		}
	});
	
	app.IconsEditorView = IconsEditorView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderIconsEditorUI()
{
	
}

function cleanIconsEditorUI()
{
	
}
