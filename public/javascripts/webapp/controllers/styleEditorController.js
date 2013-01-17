
(function() {
	'use strict';

	var StyleEditorController = Ember.ObjectController.extend({});

	//==================================================================//

	StyleEditorController.renderUI = function()
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
			
				// if creating a new style : copy the selected style as a new style
				if(!App.stylesData.editingStyle)
				{
					var newStyle = {
							name : "CopyOf" + App.stylesData.selectedStyle.name,
							content : App.stylesData.selectedStyle.content,
							uid  : App.stylesData.selectedStyle.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
					};
					
					App.stylesData.set("selectedStyle", newStyle);
				}
	
				//-----------------------------
				// retrieve the content from the tileServer
				StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){
					//-----------------------------
					// rendering after reception
					
					StyleEditorController.renderStyle();
					StyleEditorController.renderMap();
					$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
					
					ExtensionMapEditing.init($("#mapEditorTree"), $("#mapEditorWidget"), App.stylesData.map, App.stylesData.selectedStyle.content);
				});
	         }
      	);
	}

	StyleEditorController.cleanUI = function()
	{
		StyleEditorController.cleanStyle();
		StyleEditorController.cleanMap();
	}

	//------------------------------------------------//

	StyleEditorController.renderMap = function()
	{
		App.stylesData.map = new GLMap ( "map" );
		App.stylesData.map.Start();

		$("#map").css("height", $("#webappDiv").height() );
		$("#map").css("width", $("#webappDiv").width() );
	}

	StyleEditorController.cleanMap = function()
	{
		$("#map").remove();
	}
	
	//------------------------------------------------//

	StyleEditorController.renderStyle = function()
	{
		$("#style").dialogr({
			width:460,
			minWidth:460,
			height:590,
			position : [15,170],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
	}

	StyleEditorController.cleanStyle = function()
	{
		$("#style").remove();
	}
	
	//==================================================================//
	// Controls
	//------------------------------------------------//
	
	StyleEditorController.saveStyle = function()
	{
		App.stylesData.set('selectedStyle.name', $("#styleNameInput").val());
		
		if(App.stylesData.editingStyle)
			StyleManager.saveStyle(App.stylesData.selectedStyle);
		else
			StyleManager.uploadNewStyle(App.stylesData.selectedStyle);
	}

	//------------------------------------------------//
	
	App.StyleEditorController = StyleEditorController;
	
	//==================================================================//
	// Routing

	App.StyleEditorRouting = Ember.Route.extend({
		route: '/styleEditor',
		
		connectOutlets: function(router) {
			App.Router.openView(router, "styleEditor");
		},

        //--------------------------------------//
        // actions
	
	});

	//==================================================================//
	
})();

