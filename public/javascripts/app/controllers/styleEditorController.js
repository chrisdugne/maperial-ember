
(function( app ) {
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
		                         "http://map.x-ray.fr/js/maps.js"],
                 function()
                 {
					app.stylesData.selectedStyle.name = "CopyOf" + app.stylesData.selectedStyle.name;
					$("#styleNameInput").val(app.stylesData.selectedStyle.name);
					
					StyleEditorController.renderStyle();
					StyleEditorController.renderMap();
      				$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
      				
      				StyleManager.getStyle(app.stylesData.selectedStyle.uid);
                 }
      	);
	}

	StyleEditorController.cleanUI = function()
	{
		StyleEditorController.cleanStyle();
		StyleEditorController.cleanMap();
	}

	//==================================================================//
	// Controls

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
	
	//------------------------------------------------//
	
	StyleEditorController.saveStyle = function()
	{
		app.stylesData.selectedStyle.name = $("#styleNameInput").val();
		StyleManager.uploadNewStyle(app.stylesData.selectedStyle);
	}

	//------------------------------------------------//
	
	app.StyleEditorController = StyleEditorController;
	
	//==================================================================//
	// Routing

	app.StyleEditorRouting = Ember.Route.extend({
		route: '/styleEditor',
		connectOutlets: function(router) {
			app.Router.openView(router, "styleEditor");
		},

        //--------------------------------------//
        // actions
		
		saveStyle: function(router, event){
			StyleEditorController.saveStyle();
		}
	
	});

	//==================================================================//
	
})( window.Webapp );

