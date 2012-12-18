
(function( app ) {
	'use strict';

	var TryscreenController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	TryscreenController.renderUI = function()
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
      				renderColorBar();
      				renderStyle();
      				initColorPicker();
      				
      				renderMap();
      				$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
                 }
      	);
	}

	TryscreenController.cleanUI = function()
	{
		cleanColorBar();
		cleanStyle();
		cleanColorPicker();
		cleanMap();
	}

	//------------------------------------------------//
	
	app.TryscreenController = TryscreenController;

})( window.Webapp );