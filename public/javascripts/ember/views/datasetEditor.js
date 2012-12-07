(function( app ) {
	'use strict';

	var DatasetEditorView = Ember.View.extend({
		templateName: 'datasetEditor',
		didInsertElement: function(){
			renderDatasetUI();
		},
		willDestroyElement: function(){
			cleanDatasetUI();
		}
	});
	
	app.DatasetEditorView = DatasetEditorView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderDatasetUI()
{
	$('#uploadDatasetWindow').modal();
}

function cleanDatasetUI()
{
	
}
