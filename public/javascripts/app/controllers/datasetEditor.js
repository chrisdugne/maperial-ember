
(function( app ) {
	'use strict';

	var DatasetEditorController = Ember.ObjectController.extend({});

	//--------------------------------------------------------------------------//
		
	DatasetEditorController.renderUI = function()
	{
		ScriptLoader.getScripts([
	           //-- extension.upload
	           "assets/javascripts/extensions/upload/tmpl.min.js",
	           "assets/javascripts/extensions/upload/load-image.min.js",
	           "assets/javascripts/extensions/upload/canvas-to-blob.min.js",
	           "assets/javascripts/extensions/upload/jquery.iframe-transport.js",
	           "assets/javascripts/extensions/upload/jquery.fileupload.js",
	           "assets/javascripts/extensions/upload/jquery.fileupload-fp.js",
	           "assets/javascripts/extensions/upload/jquery.fileupload-ui.js",
	           "assets/javascripts/extensions/upload/main.js"
	           ],
	       function(){
				extensionUpload.init();
			}
		);
	}

	DatasetEditorController.cleanUI = function()
	{
		
	}

	//--------------------------------------------------------------------------//

	DatasetEditorController.openUploadWindow = function() 
	{
		$('#uploadDatasetsWindow').modal();
	}

	//--------------------------------------------------------------------------//
	
	app.DatasetEditorController = DatasetEditorController;

})( window.Webapp );
