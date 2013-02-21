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
      App.homeScroller = new HomeScroller();

      $(window).resize(function() {
         App.resizeWindow();
      });
   }

   //------------------------------------------------------//
   
   App.resizeWindow = function()
   {
      if(App.Globals.currentMapEditor){
         App.Globals.currentMapEditor.map.resize($("#webappDiv").width(), $(window).height());
      }

      var webAppHeight = $(window).height() - App.Globals.FOOTER_HEIGHT ;

      try{
         webAppHeight -= $(".webappContent").css("margin-top").split("px")[0] ;
         $(".webappContent").css("min-height", webAppHeight );
      }catch(e){}
      
      try{
         webAppHeight -= $("#mapEditorContent").css("margin-top").split("px")[0] ;
         $("#mapEditorContent").css("min-height", webAppHeight );
      }catch(e){}

      console.log("webAppHeight : " + webAppHeight);
      console.log("mapheight : " + ($(window).height() - App.Globals.FOOTER_HEIGHT));
      
      App.homeScroller.resizeWindow($("#webappDiv").width());
   }

   //------------------------------------------------------//

})( this );
