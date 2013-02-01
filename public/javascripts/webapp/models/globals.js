(function() {
   'use strict';

   var Globals = Ember.Object.extend({
      isLocal: window.location.hostname == "localhost",
      debug: false,
      mapServer: '//map.x-ray.fr',
      apiKey: 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8',
      scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      googleClientId : window.location.hostname == "localhost" ? '643408271777.apps.googleusercontent.com' : '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com',
      APP_URL : window.location.hostname == "localhost" ? 'http://localhost:9000' : 'http://mapnify.herokuApp.com',
      currentView: "",
      parentView: "",
      currentPage: "",

      //-------------------------------------------//
      // mapcreation - wizardStepper in header
      isViewDatasetSelection: false,
      isViewStyleAndColorbar: false,
      isViewGeneration: false
   });

   //------------------------------------------------------//
   
   App.Globals = Globals.create();
   
})( App);
