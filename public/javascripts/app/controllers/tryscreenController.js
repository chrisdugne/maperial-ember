
(function( app ) {
	'use strict';

	var TryscreenController = Ember.ObjectController.extend({});

	//==================================================================//

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
					TryscreenController.renderColorBar();
					TryscreenController.renderStyle();
					TryscreenController.initColorPicker();
      				
					TryscreenController.renderMap();
      				$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
                 }
      	);
	}

	TryscreenController.cleanUI = function()
	{
		TryscreenController.cleanColorBar();
		TryscreenController.cleanStyle();
		TryscreenController.cleanColorPicker();
		TryscreenController.cleanMap();
	}

	//==================================================================//
	// Controls

	TryscreenController.renderColorBar = function()
	{
		$("#colorbar").dialogr({
			position : [80,110],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
		
	}

	TryscreenController.cleanColorBar = function()
	{
		$("#colorbar").remove();
	}
	
	//------------------------------------------------//


	TryscreenController.initColorPicker = function()
	{
		$("#colorpicker").dialogr({
			position : [380,210],
			closeOnEscape: false,
			dialogClass: 'no-close',
			autoOpen: false,
			show: {effect: 'fade', duration: 250},
			hide: {effect: 'fade', duration: 250}
		});
	}

	TryscreenController.cleanColorPicker = function()
	{
		$("#colorpicker").remove();
	}


	TryscreenController.openColorPicker = function(div)
	{
		var position = $("#"+div.id).offset();
		var left = position.left;
		var top = position.top;

		$("#colorpicker").html("<div id=\"picker\"></div>")
						 .dialogr('option', 'title', 'Color')
						 .dialogr('option', 'width', 300)
						 .dialogr('option', 'height', 380)
						 .dialogr('option', 'position', [left, top])
						 .dialogr("open");

		$("#picker").colorpicker({color:rgb2hex(div.style.backgroundColor)})
		.on('change.color', function(evt, color){
			$('#'+div.id).attr('style','background-color:'+color);
			$("#colorpicker").dialogr("close");
		});
	}
	
	//------------------------------------------------//

	TryscreenController.renderMap = function()
	{
		var maps = new GLMap ( "map" );
		maps.Start();

		$("#map").css("height", $("#webappDiv").height() );
		$("#map").css("width", $("#webappDiv").width() );
	}

	TryscreenController.cleanMap = function()
	{
		$("#map").remove();
	}
	
	//------------------------------------------------//

	TryscreenController.renderStyle = function()
	{
		$("#style").dialogr({
			position : [80,410],
			closeOnEscape: false,
			dialogClass: 'no-close'
		});
	}

	TryscreenController.cleanStyle = function()
	{
		$("#style").remove();
	}
	
	//------------------------------------------------//
	
	app.TryscreenController = TryscreenController;

	//==================================================================//
	// Routing

	app.TryscreenRouting = Ember.Route.extend({
		route: '/tryscreen',
		connectOutlets: function(router){
			app.Router.openView(router, "tryscreen");
		},
		openLoginWindow: function(){app.HomeController.openLoginWindow()}
	});

	//==================================================================//

})( window.Webapp );