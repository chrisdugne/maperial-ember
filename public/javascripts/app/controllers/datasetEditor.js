
(function( app ) {
	'use strict';

	var DatasetEditorController = Ember.ObjectController.extend({});

	app.DatasetEditorController = DatasetEditorController;

})( window.Webapp );

//--------------------------------------------------------------------------//
	
function renderDatasetUI()
{
	getScripts(["assets/javascripts/libs/upload/tmpl.min.js",
               "assets/javascripts/libs/upload/load-image.min.js",
               "assets/javascripts/libs/upload/canvas-to-blob.min.js",
               "assets/javascripts/libs/upload/jquery.iframe-transport.js",
               "assets/javascripts/libs/upload/jquery.fileupload.js",
               "assets/javascripts/libs/upload/jquery.fileupload-fp.js",
               "assets/javascripts/libs/upload/jquery.fileupload-ui.js",
               "assets/javascripts/libs/upload/main.js"],
           function(){
				$("#uploadDatasetButton").click(openUploadWindow);
			}
	);
}

function cleanDatasetUI()
{
	
}

//--------------------------------------------------------------------------//

function openUploadWindow() 
{
	$('#uploadDatasetsWindow').modal();
}