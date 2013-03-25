(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 100,

      RASTER_DEFAULT_ZMIN: 4,
      RASTER_DEFAULT_ZMAX: 10,

      //-------------------------------------------//

      isLocal: window.location.hostname == "localhost",
      debug: false,
      mapServer: '//maperial.com',
//      mapServer: '//map.x-ray.fr',
      apiKey: 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8',
      scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      googleClientId : window.location.hostname == "localhost" ? '643408271777.apps.googleusercontent.com' : '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com',
      APP_URL : window.location.hostname == "localhost" ? 'http://localhost:9000' : 'http://maperial.herokuApp.com',
      maperialEmail: "",
      currentView: "",
      parentView: "",
      currentPage: "",
      epsg: [],
      separators: [",", ";", "|", "\t"],

      //-------------------------------------------//
      // mapcreation - wizardStepper in header
      isViewLayerCreation: false,
      isViewDatasetSelection: false,
      isViewStyleAndColorbar: false,
      isViewGeneration: false
   });

   //------------------------------------------------------//

   App.Globals = Globals.create();
   App.maperial = new Maperial();
   App.mapManager = new MapManager();
   App.youtubeManager = new YoutubeManager();
   
   App.initWindowSize(); // we now have HEADER_HEIGHT and FOOTER_HEIGHT : possible to set webappdiv.min-height

   //------------------------------------------------------//
   // create footer email

   var guymal_enc= "ncjjiFkgvho`(eik";
   var email = "";
   for(var i=0;i<guymal_enc.length;++i)
   {
      email += String.fromCharCode(6^guymal_enc.charCodeAt(i));
   }

   App.Globals.set("maperialEmail", email);

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
})( App);
