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
         console.log("READY");
         console.log("$(window).height() : " + $(window).height());

         var webAppHeight = $(window).height() - App.Globals.FOOTER_HEIGHT; // on nenleve pas le header car il est inclus dans la webapp
         console.log("webAppHeight : " + webAppHeight);
         $("#webappDiv").css("min-height", webAppHeight );
      });   
   }

   //------------------------------------------------------//

})( this );
