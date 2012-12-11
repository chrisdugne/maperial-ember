
(function( app ) {
	'use strict';

	var Test1Controller = Ember.ObjectController.extend({});

	app.Test1Controller = Test1Controller;

})( window.Webapp );

//--------------------------------------------------------------------------//

function renderTest1UI()
{
	getScripts([
	            //map dep
	            "http://map.x-ray.fr/js/gl-matrix-min.js",
	            "http://map.x-ray.fr/js/gl-tools.js",
	            "http://map.x-ray.fr/js/coordinate-system.js",
	            "http://map.x-ray.fr/js/jquery.mousewheel.min.js",
	            "http://map.x-ray.fr/js/tileRenderer.js",
	            "http://map.x-ray.fr/js/render-text.js",
	            "http://map.x-ray.fr/js/render-line.js",
	      
	            //menu dep
	            "assets/javascripts/extensions/maps/v_colortool.js",
	            "assets/javascripts/extensions/maps/v_symbolizer.js",
	            "assets/javascripts/extensions/maps/colorpicker.js",

	            //CB dep
	            "assets/javascripts/extensions/maps/canvasutilities.js",
	            "http://map.x-ray.fr/js/RGBColor.js",
	               
	            //ajax spin wait
	            "assets/javascripts/extensions/maps/ajaxwaitspin.js",

	            //colorBar script
	            "assets/javascripts/extensions/maps/colorBar.js",

	            //menu script
	            /// ATTENTION c'est moi qui lit les json de style dans ce test, ils seront dispo pour le renderTile (variable style)
	            "assets/javascripts/extensions/maps/v_mapnifyMenu.js",

	            "http://map.x-ray.fr/js/maps.js"],
	           function()
	           {
					var bar = null;
					//var bar2 = null;
					$(function(){
					  
					  // met's load the map
					  //var maps = new GLMap ( "testMap" );
					  //maps.Start ();
					  //window.setInterval(function(){maps.DrawScene(false,true);}, 2000);
			
					  // ok that's all we have to do to set up menu :-) 
					  MapnifyInitMenu($("#mapnifyMenu"));
					  // and the color scale <;-()
					  bar = new Bar(50,355,$("#mapnifyColorBar"),50,40,true,25.4,375.89);
					  
			
					  //bar2 = new Bar(30,255,$("#mapnifyColorBar2"),50,40,true,25.4,375.89);
					  //how to get value from colorBar ?
					  //alert(bar.GetColor(bar.GetIndex(75.85))); // use this to get color at some index / value
			
					}); // when body is ready ...
			
			
			
					/////////////////////////////
					//test test test
					/////////////////////////////
					jQuery.extend({
					  random: function(X) {
					     return Math.floor(X * (Math.random() % 1));
					  },
					  randomBetween: function(MinV, MaxV) {
					     return MinV + jQuery.random(MaxV - MinV + 1);
					  }
					});
			
					$(function() {
					    var spinner1 = $( "#spinnermin" ).spinner({
					      spin: function( event, ui ) {
					          bar.setMinVal($(this).spinner("value"));
					      },
					      change: function( event, ui ) {
					          bar.setMinVal($(this).spinner("value"));
					      }
					    });
					    spinner1.spinner( "value", 5 );
					    var spinner2 = $( "#spinnermax" ).spinner({
					      spin: function( event, ui ) {
					          bar.setMaxVal($(this).spinner("value"));
					      },
					      change: function( event, ui ) {
					          bar.setMaxVal($(this).spinner("value"));
					      }
					    });
					    spinner2.spinner( "value", 124 );
					    var spinner3 = $( "#spinnerw" ).spinner({
					      spin: function( event, ui ) {
					          bar.setWidth($(this).spinner("value"));
					      },
					      change: function( event, ui ) {
					          bar.setWidth($(this).spinner("value"));
					      }
					    });
					    spinner3.spinner( "value", 50 );
					    var spinner4 = $( "#spinnerh" ).spinner({
					      spin: function( event, ui ) {
					          bar.setHeight($(this).spinner("value"));
					      },
					      change: function( event, ui ) {
					          bar.setHeight($(this).spinner("value"));
					      }
					    });
					    spinner4.spinner( "value", 355 );
					    
					    $("#testtest").draggable();
					    $("#testtest").animate({left:"+="+($(window).width()/2-150)},1000);
					    $("#testtest").hide();
					});
					/////////////////////////////
					// end end end test test test
					/////////////////////////////

	           }
		);
}

function cleanTest1UI()
{
	
}