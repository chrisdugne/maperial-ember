(function( win ) {
   'use strict';

   win.App = Ember.Application.create({
      VERSION: '1.0',
      rootElement: '#webappDiv',
      //storeNamespace: 'todos-emberjs',
      // Extend to inherit outlet support
      ApplicationController: Ember.Controller.extend(),
      ready: function() {
         //	initialisation is done inside model.Globals
      }
   });

   //------------------------------------------------------//

   App.initWindowSize = function()
   {
      App.homeScroller = new HomeScroller();
      App.refreshSizes();

      $(window).resize(function() {
         App.refreshSizes();
      });
   }

   //------------------------------------------------------//
   
   App.refreshSizes = function()
   {
      //------------------------------------------
      
      var webAppHeight = $(window).height() - App.Globals.FOOTER_HEIGHT ;

      try{
         webAppHeight -= $(".webappContent").css("margin-top").split("px")[0] ;
         $(".webappContent").css("min-height", webAppHeight );
      }catch(e){}
      
      try{
         webAppHeight -= $("#mapEditorContent").css("margin-top").split("px")[0] ;
         $("#mapEditorContent").css("min-height", webAppHeight );
      }catch(e){}

      //------------------------------------------
      
      App.homeScroller.resizeWindow($("#webappDiv").width());
   }

   //------------------------------------------------------//

   $(window).on(MapnifyEvent.REFRESH_SIZES, function(){
      console.log("mapnify asks to refresh sizes");
      App.refreshSizes();
   });
   
   $(window).on(MapnifyEvent.LOADING, function(){
      console.log("mapnify is  LOADING");
      App.user.set("waiting", true);
   });
   
   $(window).on(MapnifyEvent.FREE, function(){
      $("#footer").css({ position : "fixed" });
      App.user.set("waiting", false);
      console.log("mapnify is  FREE");
   });

})( this );
