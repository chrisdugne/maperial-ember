
(function() {
	'use strict';

	var DatasetsController = Ember.ObjectController.extend({});

	//==================================================================//
	 
	DatasetsController.renderUI = function()
	{
	   ScriptLoader.getScripts([
                      //-- extension.upload
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
            uid  : data.result.files[0].datasetUID,
            rasters : []
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
	
	DatasetsController.openConfigureRasterWindow = function(dataset) 
	{
	   App.datasetsData.set("selectedDataset", dataset);
	   App.datasetsData.set("rasterBeingConfigured", {});
	   App.datasetsData.set("rasterBeingConfigured.zMin", 4);
	   App.datasetsData.set("rasterBeingConfigured.zMax", 14);

	   $( "#projections" ).autocomplete({
	      source: App.Globals.epsg
	    });
	   
	   $('#configureRasterWindow').modal();
	   
	   $( "#rasterZoomSlider" ).slider({
         range: true,
         min: 1,
         max: 18,
         values: [ App.datasetsData.rasterBeingConfigured.zMin, App.datasetsData.rasterBeingConfigured.zMax ],
         change: function( event, ui ) {
            var minV = ui.values[0];
            var maxV = ui.values[1];
            App.datasetsData.set("rasterBeingConfigured.zMin", minV);
            App.datasetsData.set("rasterBeingConfigured.zMax", maxV);
         },
         slide: function( event, ui ) {
            if ( (ui.values[0] + 1) > ui.values[1] ) {
               return false;      
            }                      
            var minV = ui.values[0];
            var maxV = ui.values[1];
            App.datasetsData.set("rasterBeingConfigured.zMin", minV);
            App.datasetsData.set("rasterBeingConfigured.zMax", maxV);
         }
	   });
	}

	//----------------------------------------------------//
	
	DatasetsController.selectX = function(column){
	   App.datasetsData.set("rasterBeingConfigured.x", column);
	} 

	DatasetsController.selectY = function(column){
	   App.datasetsData.set("rasterBeingConfigured.y", column);
	} 

	DatasetsController.selectV = function(column){
	   App.datasetsData.set("rasterBeingConfigured.v", column);
	} 

	//----------------------------------------------------//
	
	App.DatasetsController = DatasetsController;

	//==================================================================//
	// Routing

	App.DatasetsRouting = Ember.Route.extend({
		route: '/datasets',
		
		connectOutlets: function(router){
			App.Router.openPage(router, "datasets");
		},
		
		//-----------------------------------------------//
		// actions
		
		// ---- upload actions
		startUpload: function(router, event){
         DatasetsController.startUpload(event.context);
      },

      cancelUpload: function(router, event){
         DatasetsController.removeUpload(event.context);
      },

      removeUpload: function(router, event){
         DatasetsController.removeUpload(event.context);
      },
      
      openUploadWindow: function(){DatasetsController.openUploadWindow()},

      // ---- 		
		deleteDataset: function(router, event){
			var dataset = event.context;
			DatasetManager.deleteDataset(dataset);
		},

		// ---- 		
      createRaster: function(){
         DatasetManager.createRaster();
      },
      
      openConfigureRasterWindow: function(router, event){
         var dataset = event.context;
         DatasetsController.openConfigureRasterWindow(dataset);
      },

		deleteRaster: function(router, event){
		   var raster = event.contexts[0];
		   var dataset = event.contexts[1];
		   DatasetManager.deleteRaster(raster, dataset);
		},
		// ---- 		

		selectX: function(router, event){
		   var column = event.context;
		   DatasetsController.selectX(column);
		},

		selectY: function(router, event){
		   var column = event.context;
		   DatasetsController.selectY(column);
		},
		
		selectV: function(router, event){
		   var column = event.context;
		   DatasetsController.selectV(column);
		},

	});


	
	//--------------------------------------------------------------------------//
	
})();

