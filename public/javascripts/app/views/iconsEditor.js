(function( app ) {
	'use strict';

	var IconsEditorView = Ember.View.extend({
		templateName: 'iconsEditor',
		didInsertElement: function(){
			app.IconsEditorController.renderUI();
		},
		willDestroyElement: function(){
			app.IconsEditorController.cleanUI();
		}
	});
	
	app.IconsEditorView = IconsEditorView;

})( window.Webapp);