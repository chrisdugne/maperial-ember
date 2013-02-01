(function( win ) {
	'use strict';
	
	win.App = Ember.Application.create({
		VERSION: '1.0',
		rootElement: '#webappDiv',
		//storeNamespace: 'todos-emberjs',
		// Extend to inherit outlet support
		ApplicationController: Ember.Controller.extend(),
		ready: function() {
		//	this.initialize();
		}
	});


   //------------------------------------------------------//

	App.initWindowSize = function()
   {
	   App.resizeWindow();

      $(window).resize(function() {
         App.resizeWindow();
      });
   }

   //------------------------------------------------------//

	App.resizeWindow = function()
   {
      $(document).ready(function() {
           var webAppHeight = $(window).height() - $("#header").height() - $("#footer").height() - 120;
           $("#webappDiv").css("min-height", webAppHeight );
         });   
   }
	
	//------------------------------------------------------//

   App.initWindowSize();

   //------------------------------------------------------//
   
})( this );
