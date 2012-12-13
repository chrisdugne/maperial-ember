
this.extensionMapEditing = {};
extensionMapEditing.init = function () 
{
	console.log("init extensionMapEditing");
	
	var bar = null;
	//var bar2 = null;
	$(function(){
	  
	  // met's load the map
	  //var maps = new GLMap ( "testMap" );
	  //maps.Start ();
	  //window.setInterval(function(){maps.DrawScene(false,true);}, 2000);

	  // ok that's all we have to do to set up menu :-) 
	  MapnifyMenu.init($("#mapnifyMenu"));
	  
	  // and the color scale <;-()
	  bar = new ColorBar.Bar(50,355,$("#mapnifyColorBar"),50,40,true,25.4,375.89);
	  

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