
(function() {
	'use strict';

	var DatasetsController = Ember.ObjectController.extend({});

	//==================================================================//
	 
	DatasetsController.renderUI = function()
	{
	   ScriptLoader.getScripts([
                      //-- extension.upload
                      "assets/javascripts/extensions/upload/jquery.iframe-transport.js",
                      "assets/javascripts/extensions/upload/jquery.fileupload.js",
                      "assets/javascripts/extensions/upload/main.js"
                      ],
            function(){
	            ExtensionUpload.init();
	         }
	   );
	}

	DatasetsController.cleanUI = function()
	{
	   console.log("DatasetsController.cleanUI");
	}

	//==================================================================//
	// Controls

	DatasetsController.openUploadWindow = function() 
	{
		$('#uploadDatasetsWindow').modal();
	}

	
	DatasetsController.startUpload = function(data) 
	{
      data.isUploading = true;
      data.submit();

      App.datasetsData.filesToUpload.removeObject(data);
	}

	
	DatasetsController.removeUpload = function(data) 
	{
      App.datasetsData.filesToUpload.removeObject(data);
	}

	
	DatasetsController.progressUpload = function(data) 
	{
	   var progress = parseInt(data.loaded / data.total * 100, 10);
	   var index = App.datasetsData.filesToUpload.indexOf(data);
	   
	   // -> first progressUpload : add the data in filesToUpload
	   if(index == -1){
	      App.datasetsData.filesToUpload.pushObject(data);
	      index = App.datasetsData.filesToUpload.indexOf(data);
	   }

	   var data = App.datasetsData.filesToUpload.objectAt(index);
      
	   var proxy = Ember.ObjectProxy.create({
	      content: data
	   });

	   proxy.set("percentage", progress);
	}
	
	
	DatasetsController.doneUpload = function(data) 
	{
	   //--------------------------------------------
	   // placement dans users.datasets
	   
	   // data.files[0] = file envoyé
      // data.result.files[0] = file retour upload

      var dataset = {
            name : data.result.files[0].name,
            size : data.result.files[0].size,
            uid  : data.result.files[0].datasetUID
      };
      
      App.user.datasets.pushObject(dataset);

      //--------------------------------------------
      // binding de datasetsData.filesToUpload
      
      App.datasetsData.filesToUpload.removeObject(data);
      
      data.isUploading = false;
      data.isUploaded = true;
      
      DatasetManager.addDataset(dataset);

      // binding
      App.datasetsData.filesToUpload.pushObject(data);
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

		startUpload: function(router, event){
		   DatasetsController.startUpload(event.context);
		},

		cancelUpload: function(router, event){
		   DatasetsController.removeUpload(event.context);
		},

		removeUpload: function(router, event){
		   DatasetsController.removeUpload(event.context);
		},
		
		openUploadWindow: function(){DatasetsController.openUploadWindow()}
	});

	//--------------------------------------------------------------------------//
	
})();

