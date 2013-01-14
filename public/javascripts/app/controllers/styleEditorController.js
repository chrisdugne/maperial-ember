
(function() {
	'use strict';

	var StyleEditorController = Ember.ObjectController.extend({});

	//==================================================================//

	StyleEditorController.renderUI = function()
	{
		ScriptLoader.getScripts(["http://map.x-ray.fr/js/gl-matrix-min.js",
		                         "http://map.x-ray.fr/js/gl-tools.js",
		                         "http://map.x-ray.fr/js/coordinate-system.js",
		                         "http://map.x-ray.fr/js/jquery.mousewheel.min.js",
		                         "http://map.x-ray.fr/js/render-line.js",
		                         "http://map.x-ray.fr/js/render-text.js",
		                         "http://map.x-ray.fr/js/tileRenderer.js",
		                         "http://map.x-ray.fr/js/maps.js",
                             "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_colortool.js"),
                             "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_symbolizer.js"),
                             "http://serv.x-ray.fr/project/mycarto/wwwClient/js/colorpicker.js"),
                             "http://serv.x-ray.fr/project/mycarto/wwwClient/js/v_mapnifyMenu3.js")],
                 function()
                 {
					//-----------------------------
					// copy the selected style as a new style
				
			    	var newStyle = {
						name : "CopyOf" + App.stylesData.selectedStyle.name,
						content : App.stylesData.selectedStyle.content,
						uid  : App.stylesData.selectedStyle.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
		    		};
			    	
					App.stylesData.selectedStyle = newStyle;
					$("#styleNameInput").val(newStyle.name);

					// retrieve the content from the tileServer
					StyleManager.getStyle(App.stylesData.selectedStyle.uid);

					//-----------------------------
					// rendering
					
					StyleEditorController.renderStyle();
					StyleEditorController.renderMap();
      				$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
                 }
          extensionMapEditing.init($("#mapEditorTree"),$("#mapEditorWidget"),App.stylesData.map);
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
		var maps = new GLMap ( "map" );
		maps.Start();

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
			width:290,
			minWidth:290,
			height:550,
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
		App.stylesData.selectedStyle.name = $("#styleNameInput").val();
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

