
(function() {
	'use strict';

	var StyleEditorController = Ember.ObjectController.extend({});

	//==================================================================//

	StyleEditorController.renderUI = function()
	{
		App.user.set("waiting", true);

		ScriptLoader.getScripts([
	                         // map rendering
	                         "assets/javascripts/libs/gl-matrix-min.js",
	                         "assets/javascripts/libs/jquery.mousewheel.min.js",
	                         "assets/javascripts/extensions/maprendering/gl-tools.js",
	                         "assets/javascripts/extensions/maprendering/coordinate-system.js",
	                         "assets/javascripts/extensions/maprendering/render-line.js",
	                         "assets/javascripts/extensions/maprendering/render-text.js",
	                         "assets/javascripts/extensions/maprendering/tileRenderer.js",
	                         "assets/javascripts/extensions/maprendering/gl-map.js",
	                         
	                         // map editing
	                         "assets/javascripts/extensions/mapeditortools/v_colortool.js",
	                         "assets/javascripts/extensions/mapeditortools/v_symbolizer.js",
	                         "assets/javascripts/extensions/mapeditortools/colorpicker.js",
	                         "assets/javascripts/extensions/mapeditortools/RGBColor.js",

	                         // style
	                         "assets/javascripts/extensions/style/v_mapnifyMenu3.js",
	                         "assets/javascripts/extensions/style/main.js"],
	         function()
	         {
				//-----------------------------
				
				// if creating a new style : copy the selected style as a new style
				if(!App.stylesData.editingStyle)
				{
					console.log("Creating a new style");
					var newStyle = {
							name : "CopyOf" + App.stylesData.selectedStyle.name,
							content : App.stylesData.selectedStyle.content,
							uid  : App.stylesData.selectedStyle.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
					};
					console.log(newStyle.name);
					
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
					
					ExtensionStyle.init($("#mapEditorTree"), $("#mapEditorWidget"), App.stylesData.map, App.stylesData.selectedStyle.content);

					App.user.set("waiting", false);
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

