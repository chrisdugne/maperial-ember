
(function() {
	'use strict';

	var ColorbarEditorController = Ember.ObjectController.extend({});

	//==================================================================//

	ColorbarEditorController.renderUI = function()
	{
		ScriptLoader.getScripts([
	                         // map rendering
	                         "http://map.x-ray.fr/js/gl-matrix-min.js",
	                         "http://map.x-ray.fr/js/gl-tools.js",
	                         "http://map.x-ray.fr/js/coordinate-system.js",
	                         "http://map.x-ray.fr/js/jquery.mousewheel.min.js",
	                         "http://map.x-ray.fr/js/render-line.js",
	                         "http://map.x-ray.fr/js/render-text.js",
	                         "http://map.x-ray.fr/js/tileRenderer.js",
	                         "http://map.x-ray.fr/js/maps.js",
	                         
	                         // map editing
	                         "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_colortool.js",
	                         "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_symbolizer.js",
	                         "assets/javascripts/extensions/mapediting/colorpicker.js",
//	                         "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_mapnifyMenu3.js",
	                         "assets/javascripts/extensions/mapediting/v_mapnifyMenu3.js",
	                         "assets/javascripts/extensions/mapediting/main.js"],
	         function()
	         {
				//-----------------------------
			
				// if creating a new colorbar : copy the selected colorbar as a new colorbar
				if(!App.colorbarsData.editingColorbar)
				{
					var newColorbar = {
							name : "CopyOf" + App.colorbarsData.selectedColorbar.name,
							content : App.colorbarsData.selectedColorbar.content,
							uid  : App.colorbarsData.selectedColorbar.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
					};
					
					App.colorbarsData.set("selectedColorbar", newColorbar);
				}
	
				//-----------------------------
				// retrieve the content from the tileServer
				ColorbarManager.getColorbar(App.colorbarsData.selectedColorbar.uid, function(){
					//-----------------------------
					// rendering after reception
					
					ColorbarEditorController.renderColorbar();
					ColorbarEditorController.renderMap();
					$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
					
					ExtensionMapEditing.init($("#mapEditorTree"), $("#mapEditorWidget"), App.colorbarsData.map, App.colorbarsData.selectedColorbar.content);
				});
	         }
      	);
	}

	ColorbarEditorController.cleanUI = function()
	{
		ColorbarEditorController.cleanColorbar();
		ColorbarEditorController.cleanMap();
	}

	//------------------------------------------------//

	ColorbarEditorController.renderMap = function()
	{
		App.colorbarsData.map = new GLMap ( "map" );
		App.colorbarsData.map.Start();

		$("#map").css("height", $("#webappDiv").height() );
		$("#map").css("width", $("#webappDiv").width() );
	}

	ColorbarEditorController.cleanMap = function()
	{
		$("#map").remove();
	}
	
	//------------------------------------------------//

	ColorbarEditorController.renderColorbar = function()
	{
		$("#colorbar").dialogr({
			width:460,
			minWidth:460,
			height:590,
			position : [15,170],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
	}

	ColorbarEditorController.cleanColorbar = function()
	{
		$("#colorbar").remove();
	}
	
	//==================================================================//
	// Controls
	//------------------------------------------------//
	
	ColorbarEditorController.saveColorbar = function()
	{
		App.colorbarsData.set('selectedColorbar.name', $("#colorbarNameInput").val());
		
		if(App.colorbarsData.editingColorbar)
			ColorbarManager.saveColorbar(App.colorbarsData.selectedColorbar);
		else
			ColorbarManager.uploadNewColorbar(App.colorbarsData.selectedColorbar);
	}

	//------------------------------------------------//
	
	App.ColorbarEditorController = ColorbarEditorController;
	
	//==================================================================//
	// Routing

	App.ColorbarEditorRouting = Ember.Route.extend({
		route: '/colorbarEditor',
		
		connectOutlets: function(router) {
			App.Router.openView(router, "colorbarEditor");
		},

        //--------------------------------------//
        // actions
	
	});

	//==================================================================//
	
})();

