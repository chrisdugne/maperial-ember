
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
            var customParams = [];
            customParams["datasets"] = App.user.datasets;
            App.Router.openComponent(router, customParams);
         }
      })

      //--------------------------------------//
      // actions

      //openDatasetSelection: Ember.Route.transitionTo('mapCreation.datasetSelection')
   });

   //==================================================================//

})();