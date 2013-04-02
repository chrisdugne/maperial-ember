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

   App.initWindowSize = function() {
      
//      App.homeScroller = new HomeScroller();
      App.homeMover = new HomeMover();
      App.resize();

      $(window).resize(function() {
         App.resize();
      });
   }

   //------------------------------------------------------//
   
   App.placeFooter = function(forceFix){
 
      if($("#webappDiv").height() < $(window).height() || forceFix){
         $("#footerClassic").css({ position : "fixed" });
      }
      else{
         $("#footerClassic").css({ position : "relative" });
      }
   }

   App.resize = function() {
      //App.homeScroller.resizeWindow();
   }

   App.finishLoadings = function(nextPage){

      App.user.set("waiting", true);
      
      //------------------------------------------------------//
      // gather epsg list

      $.get('/assets/epsg.txt', function(data){
         var lines = data.split("\n");
         for(var i=0; i< lines.length; i++){
            if(lines[i][0] == "#")
               App.Globals.epsg.push(lines[i].substr(2, lines[i].length-2));
         }
      });
      
      //-------------------------------------------//
      //init getPublicData

      $.ajax({  
         type: "POST",  
         url: "/getPublicData",
         dataType: "json",
         success: function (publicData, textStatus, jqXHR)
         {
            console.log(publicData);

            App.publicData.set("maps", publicData.maps);
            App.publicData.set("styles", publicData.styles);
            App.publicData.set("datasets", publicData.datasets);
            App.publicData.set("colorbars", publicData.colorbars);
            App.publicData.set("fonts", publicData.fonts);
            App.publicData.set("icons", publicData.icons);
         }
      });
      
      //-------------------------------------------//
      
      var scripts = [];
      
      var maperialJSScripts = "";
      if(window.location.hostname != "maperial.localhost"){
         scripts.push(App.Globals.WEB_URL + "js/min/maperialjs.min.js");
      }
      
      scripts.push("http://fabricjs.com/lib/fabric.js");
      scripts.push("assets/javascripts/extensions/upload/jquery.fileupload.js");
      scripts.push("assets/javascripts/extensions/upload/main.js");

      //-------------------------------------------//
      
      window.scriptLoader.getScripts(scripts, function(){

         App.Globals.shaders.push(MapParameters.AlphaClip);
         App.Globals.shaders.push(MapParameters.AlphaBlend);
         App.Globals.shaders.push(MapParameters.MulBlend);
         
         $(window).on(MaperialEvents.LOADING, function(){
            console.log("maperial is LOADING");
            App.user.set("waiting", true);
         });
         
         $(window).on(MaperialEvents.READY, function(){
            App.placeFooter(true);
            App.user.set("waiting", false);
            console.log("maperial is READY");
         });
         
         App.maperial = new Maperial();
         App.get('router').transitionTo(nextPage);

         App.user.set("waiting", false);
      });
   }

   //------------------------------------------------------//


})( this );
