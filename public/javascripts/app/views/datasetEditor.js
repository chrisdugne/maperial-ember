(function( app ) {
	'use strict';

	var DatasetEditorView = Ember.View.extend({
		templateName: 'datasetEditor',
		didInsertElement: function(){
			app.DatasetEditorController.renderUI();
		},
		willDestroyElement: function(){
			app.DatasetEditorController.cleanUI();
		}
	});
	
	app.DatasetEditorView = DatasetEditorView;

})( window.Webapp);