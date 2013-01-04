
(function( app ) {
	'use strict';

	var StyleEditorController = Ember.ObjectController.extend({});

	//------------------------------------------------//

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
					StyleEditorController.renderStyle();
					StyleEditorController.renderOptions();
      				
					StyleEditorController.renderMap();
      				$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
                 }
      	);
	}

	StyleEditorController.cleanUI = function()
	{
		StyleEditorController.cleanStyle();
		StyleEditorController.cleanOptions();
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
			position : [80,410],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
	}

	StyleEditorController.cleanStyle = function()
	{
		$("#style").remove();
	}
	//------------------------------------------------//
	
	StyleEditorController.renderOptions = function()
	{
		$("#options").dialogr({
			position : [80,110],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
	}
	
	StyleEditorController.cleanOptions = function()
	{
		$("#options").remove();
	}
	
	//------------------------------------------------//

	app.StyleEditorController = StyleEditorController;

})( window.Webapp );

