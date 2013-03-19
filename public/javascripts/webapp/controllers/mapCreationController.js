
(function() {
   'use strict';

   var MapCreationController = Ember.ObjectController.extend({});

   //==================================================================//
   
   MapCreationController.LAYERS_CREATION = "LAYERS_CREATION";
   MapCreationController.SETTINGS = "SETTINGS";
   
   //==================================================================//
   // Rendering
   
   MapCreationController.init = function()
   {
      App.user.set("isCreatingANewMap", true);
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayers();
   }

   MapCreationController.terminate = function ()
   {
      App.user.set("isCreatingANewMap", false);  
   }
   
   //==================================================================//
   // Controls

   MapCreationController.wizardSetView = function(view)
   {
      var isViewLayerCreation = view == MapCreationController.LAYERS_CREATION;
      var isViewSettings      = view == MapCreationController.SETTINGS;
      
      App.Globals.set("isViewLayerCreation", isViewLayerCreation);
      App.Globals.set("isViewSettings", isViewSettings);   
   }
   
   // --------------------- 
   // --- dataset selection


   // --------------------- 
   // --- style selection
   

   //--------------------------------------------------------//
   
   MapCreationController.getLayersCreationConfig = function(){

      var config = {hud:[], map:{}};
      
      // custom
      // mapCreation.layersCreation
      //config["StyleManager"] = {show : true, type : HUD.PANEL, visibility : HUD.REQUIRED };

      // maperial hud
      config.hud[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    isOption : true, label : "Controls" };
      config.hud[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      
      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
            
      return config;
   }  

   //--------------------------------------------------------//
   
   MapCreationController.getSettingsConfig = function(){

      var config = {hud:[], map:{}};
      
      // custom
      // mapCreation.mapSettings
//      config["MapSettings"] = {show : true, type : HUD.PANEL, visibility : HUD.REQUIRED };

      // maperial hud
      config.hud[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    isOption : true, label : "Controls" };
      config.hud[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      return config;
   }  

   //--------------------------------------------------------//
   // --- layers

   MapCreationController.openLayers = function()
   {
      App.maperial.apply(MapCreationController.getLayersCreationConfig());
   }

   MapCreationController.backToLayers = function(){
      MapCreationController.closeSettings();
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      //App.mapEditor.changeConfig(this.getConfigStyleAndColorbar());
      //App.placeFooter();
   }

   // --------------------- 
   // --- settings

   MapCreationController.openSettings = function(){
      
      MapCreationController.wizardSetView(MapCreationController.SETTINGS);

      App.maperial.apply(this.getSettingsConfig());
//      App.mapEditor.showBoundingBox();
//      App.mapEditor.deactivateBoundingBoxDrawing();
//
//      $("#settings").removeClass("hide");
//      $("#buttonMapMode").addClass("active");
//      $("#buttonDrawMode").removeClass("active");
//      
//      $("#triggerSettings").click(function(){
//         $("#panelSettings").toggle("fast");
//         $(this).toggleClass("active");
//         return false;
//      });
//
//      $("#buttonMapMode").click(function(){
//         $(this).addClass("active");
//         $("#buttonDrawMode").removeClass("active");
//         $("#buttonCenter").removeClass("hide");
//         $("#buttonReset").addClass("hide");
//         App.mapEditor.deactivateBoundingBoxDrawing();
//         return false;
//      });
//
//      $("#buttonDrawMode").click(function(){
//         $(this).addClass("active");
//         $("#buttonMapMode").removeClass("active");
//         $("#buttonCenter").addClass("hide");
//         $("#buttonReset").removeClass("hide");
//         App.mapEditor.activateBoundingBoxDrawing();
//         return false;
//      });
//      
//      $("#buttonCenter").click(function(){
//         App.mapEditor.boundingBoxDrawer.center();
//         return false;
//      });
//      
//      $("#buttonReset").click(function(){
//         App.mapEditor.boundingBoxDrawer.cancelEdition();
//         return false;
//      });
   }

   MapCreationController.closeSettings = function(){
//      App.mapEditor.hideBoundingBox();
//      $("#settings").addClass("hide");
//      
//      $("#triggerSettings").unbind("click");
//      $("#buttonMapMode").unbind("click");
   }
   
   //--------------------------------------//

   MapCreationController.finish = function(){
      
   }
   
   //--------------------------------------//

   App.MapCreationController = MapCreationController;

   //==================================================================//
   // Routing

   App.MapCreationRouting = Ember.Route.extend({
      route: '/mapCreation',

      connectOutlets: function(router){
         App.Router.openPage(router, "mapCreation");
      },

      //--------------------------------------//
      // actions
      
   });

   //==================================================================//

})();