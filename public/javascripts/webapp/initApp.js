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
      // updating map canvas + html sizes

      if($("#map")[0]){
         $("#map").css("width", "100%");
         $("#map").css("height", $(window).height());
         $("#map")[0].width =   $("#map").width();
         $("#map")[0].height =  $("#map").height();
      }

      //------------------------------------------
      
      App.homeScroller.resizeWindow($("#webappDiv").width());
   }

   //------------------------------------------------------//

   $(window).on(Mapnify.RefreshSizes, function(){
      console.log("mapnify asks to refresh sizes");
      App.refreshSizes();
   });
   
   $(window).on(Mapnify.Loading, function(){
      console.log("mapnify is  LOADING");
      App.user.set("waiting", true);
   });
   
   $(window).on(Mapnify.Free, function(){
      $("#footer").css({ position : "fixed" });
      App.user.set("waiting", false);
      console.log("mapnify is  FREE");
   });

})( this );
