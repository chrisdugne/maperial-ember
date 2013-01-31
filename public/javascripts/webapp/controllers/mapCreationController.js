
(function() {
   'use strict';

   var MapCreationController = Ember.ObjectController.extend({});

   //==================================================================//

   MapCreationController.renderUI = function()
   {

   }

   MapCreationController.cleanUI = function()
   {

   }

   //==================================================================//
   // Controls

   App.MapCreationController = MapCreationController;

   //==================================================================//
   // Routing

   App.MapCreationRouting = Ember.Route.extend({
      route: '/mapCreation',

      connectOutlets: function(router){
         App.Router.openView(router, "mapCreation");
      },

      //--------------------------------------//
      // states

      datasetSelection: Ember.Route.extend({
         route: '/datasetSelection',
         connectOutlets: function(router) {
            var customContext = [];
            customContext["datasetsData"] = App.datasetsData;
            App.Router.openComponent(router, customContext);
         }
      })

      //--------------------------------------//
      // actions

      //openDatasetSelection: Ember.Route.transitionTo('mapCreation.datasetSelection')
   });

   //==================================================================//

})();