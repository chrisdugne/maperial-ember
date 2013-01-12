
(function() {
	'use strict';

	var DatasetsController = Ember.ObjectController.extend({});

	//==================================================================//
		
	DatasetsController.renderUI = function()
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

	DatasetsController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	DatasetsController.openUploadWindow = function() 
	{
		$('#uploadDatasetsWindow').modal();
	}

	//----------------------------------------------------//
	
	App.DatasetsController = DatasetsController;

	//==================================================================//
	// Routing

	App.DatasetsRouting = Ember.Route.extend({
		route: '/datasets',
		
		connectOutlets: function(router){
			App.Router.openView(router, "datasets");
		},
		
		//-----------------------------------------------//
		// actions
		
		deleteDataset: function(router, event){
			var dataset = event.context;
			DatasetManager.deleteDataset(dataset);
		},
		
		openUploadWindow: function(){DatasetsController.openUploadWindow()}
	});

	//--------------------------------------------------------------------------//
	
})();

