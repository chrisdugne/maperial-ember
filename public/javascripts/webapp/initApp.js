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
      var webAppHeight = $(window).height() - App.Globals.FOOTER_HEIGHT; // on nenleve pas le header car il est inclus dans la webapp
      $("#webappDiv").css("min-height", webAppHeight );

      $("#map").css("width", $("#webappDiv").width() );
      $("#map").css("height", webAppHeight - App.Globals.HEADER_HEIGHT ); // on a le header dans la webappdiv !!
   }

   //------------------------------------------------------//

})( this );
