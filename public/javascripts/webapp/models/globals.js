(function() {
   'use strict';

   var Globals = Ember.Object.extend({

      //-------------------------------------------//

      HEADER_HEIGHT: 67,
      FOOTER_HEIGHT: 101,

      RASTER_DEFAULT_ZMIN: 4,
      RASTER_DEFAULT_ZMAX: 10,
      
      //-------------------------------------------//
      
      isLocal: window.location.hostname == "localhost",
      debug: false,
      mapServer: '//map.x-ray.fr',
      apiKey: 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8',
      scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      googleClientId : window.location.hostname == "localhost" ? '643408271777.apps.googleusercontent.com' : '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com',
      APP_URL : window.location.hostname == "localhost" ? 'http://localhost:9000' : 'http://mapnify.herokuApp.com',
      mapnifyEmail: "",
      currentView: "",
      parentView: "",
      currentPage: "",
      epsg: [],
      separators: [",", ";", "|", "\t"],

      //-------------------------------------------//
      // peut etre creer un modele commun pour le mapEditor et ses donnees
      currentMapEditor: "",
      latitude: "",
      longitude: "",

      //-------------------------------------------//
      // mapcreation - wizardStepper in header
      isViewDatasetSelection: false,
      isViewStyleAndColorbar: false,
      isViewGeneration: false
   });

   //------------------------------------------------------//

   App.Globals = Globals.create();
   App.initWindowSize(); // we now have HEADER_HEIGHT and FOOTER_HEIGHT : possible to set webappdiv.min-height

   //------------------------------------------------------//

   var guymal_enc= "ncjjiFkgvho`(eik";
   var email = "";
   for(var i=0;i<guymal_enc.length;++i)
   {
      email += String.fromCharCode(6^guymal_enc.charCodeAt(i));
   }
   
   App.Globals.set("mapnifyEmail", email);

   //------------------------------------------------------//
   
   $.get('/assets/epsg.txt', function(data){
      var lines = data.split("\n");
      for(var i=0; i< lines.length; i++){
         if(lines[i][0] == "#")
            App.Globals.epsg.push(lines[i].substr(2, lines[i].length-2));
      }
   });

   //------------------------------------------------------//
})( App);
