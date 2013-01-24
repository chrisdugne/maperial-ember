
(function() {
	'use strict';

	var ColorbarEditorController = Ember.ObjectController.extend({});

	//==================================================================//

	ColorbarEditorController.renderUI = function()
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
	                         "assets/javascripts/extensions/mapeditortools/map.js",
	                         "assets/javascripts/extensions/mapeditortools/canvasutilities.js",

	                         // colorbar
	                         "assets/javascripts/extensions/colorbar/colorBar.js",
	                         "assets/javascripts/extensions/colorbar/main.js"],
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
	
				App.stylesData.set("selectedStyle", App.publicData.styles[0]);
				console.log("defaultStyle : " + App.stylesData.selectedStyle.name);
				
				//-----------------------------
				// retrieve the colorbar content from the tileServer
				ColorbarManager.getColorbar(App.colorbarsData.selectedColorbar.uid, function(){

					//-----------------------------
					// retrieve the style content from the tileServer
					StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){
						//-----------------------------
						// rendering after reception
						
						ColorbarEditorController.renderColorbar();
						ColorbarEditorController.renderMap();
						$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
						
						ExtensionColorbar.init($("#mapnifyColorBar"), App.colorbarsData.selectedColorbar.content, App.stylesData.selectedStyle.content);
	
						App.user.set("waiting", false);
					});
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
		var colorbarContent = {};
		ExtensionColorbar.fillContent(colorbarContent);
		
		App.colorbarsData.set('selectedColorbar.name', $("#colorbarNameInput").val());
		App.colorbarsData.set('selectedColorbar.content', colorbarContent);

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

