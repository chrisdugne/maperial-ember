
(function( app ) {
	'use strict';

	var Test1Controller = Ember.ObjectController.extend({});

	//==================================================================//

	Test1Controller.renderUI = function()
	{
		ScriptLoader.getScripts([
     	            //map dep
     	            "http://map.x-ray.fr/js/gl-matrix-min.js",
     	            "http://map.x-ray.fr/js/gl-tools.js",
     	            "http://map.x-ray.fr/js/coordinate-system.js",
     	            "http://map.x-ray.fr/js/jquery.mousewheel.min.js",
     	            "http://map.x-ray.fr/js/tileRenderer.js",
     	            "http://map.x-ray.fr/js/render-text.js",
     	            "http://map.x-ray.fr/js/render-line.js",
     	      
     	            //menu dep
     	            "assets/javascripts/extensions/mapediting/v_colortool.js",
     	            "assets/javascripts/extensions/mapediting/v_symbolizer.js",
     	            "assets/javascripts/extensions/mapediting/colorpicker.js",

     	            //CB dep
     	            "assets/javascripts/extensions/mapediting/canvasutilities.js",
     	            "http://map.x-ray.fr/js/RGBColor.js",
     	            "assets/javascripts/extensions/mapediting/map.js",
     	               
     	            //ajax spin wait
     	            "assets/javascripts/extensions/mapediting/ajaxwaitspin.js",
     	            
     	            //colorBar script
     	            "assets/javascripts/extensions/mapediting/colorBar.js",
     	            
     	            //menu script
     	            /// ATTENTION c'est moi qui lit les json de style dans ce test, ils seront dispo pour le renderTile (variable style)
     	            "assets/javascripts/extensions/mapediting/v_mapnifyMenu.js",

     	            //maps script
     	            "http://map.x-ray.fr/js/maps.js",

     	            // main
     	            "assets/javascripts/extensions/mapediting/main.js"],
 	           function()
 	           {
 					extensionMapEditing.init();
 	           }
 		);
	}

	Test1Controller.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	app.Test1Controller = Test1Controller;

	//==================================================================//
	// Routing

	app.Test1Routing = Ember.Route.extend({
		route: '/test1',
	
		connectOutlets: function(router){
			app.Router.openView(router, "test1");
		}
	});

	//==================================================================//

})( window.Webapp );