
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
   
   //--------------------------------------------------------//
   
   MapCreationController.getLayersCreationConfig = function(){

      var config = {hud:{elements:{}, options:{}}};
      
      // custom
      config.hud.elements["Layers"] = {show : true, type : HUD.PANEL, isOption : false, position : { right: "0", top: "0"} };

      // maperial hud
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    isOption : true, label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      
      config.hud.options["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud.options["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      config.layersCreation = true;
      
      return config;
   }  

   //--------------------------------------------------------//
   
   MapCreationController.getSettingsConfig = function(){

      var config = {hud:{elements:{}, options:{}}};      
      
      // custom
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
      MapCreationController.refreshLayersPanel();
   }

   MapCreationController.backToLayers = function(){
      MapCreationController.closeSettings();
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayers();
   }

   // --------------------- 
   
   /**
    * Draw the HUD settings panel
    */
   MapCreationController.refreshLayersPanel = function() {

      $("#layers").empty(); 
      var panelHeight = 50;

      for(var i = 0; i< App.maperial.config.layers.length; i++) {
         MapCreationController.buildLayerEntry(i);
         panelHeight += 64;
      }

      $("#panelLayers").css("height", panelHeight+"px");
      
   }

   //--------------------------------------//

   MapCreationController.buildLayerEntry = function(layerIndex) {
      
      var layer = App.maperial.config.layers[layerIndex];
      
      $("#layers").append(
            "<div class=\"row-fluid\">" +
      		"   <div class=\"span4 offset1\"><img src=\"assets/images/icons/layer."+layer.source.type+".png\"></img></div>" +
      		"   <div class=\"span1 offset1\"><button class=\"btn-small btn-success\" onclick=\"App.MapCreationController.editLayer("+layerIndex+")\"><i class=\"icon-edit icon-white\"></i></button></div>" +
      		"   <div class=\"span1 offset2\"><button class=\"btn-small btn-danger\" onclick=\"App.MapCreationController.deleteLayer("+layerIndex+")\"><i class=\"icon-trash icon-white\"></i></button></div>" +
      		"</div>"
      ); 

   }
   
   //--------------------------------------//

   MapCreationController.addLayer = function(){
      App.maperial.layersManager.addLayer(Source.MaperialOSM);
      MapCreationController.refreshLayersPanel();
   }

   //--------------------------------------//

   MapCreationController.editLayer = function(layerIndex){
      var layer = App.maperial.config.layers[layerIndex];
   }
   
   //--------------------------------------//
   
   MapCreationController.deleteLayer = function(layerIndex){
      App.maperial.layersManager.deleteLayer(layerIndex);
      MapCreationController.refreshLayersPanel();
   }
   
   // --------------------- 
   // --- settings

   MapCreationController.openSettings = function(){
      
      MapCreationController.wizardSetView(MapCreationController.SETTINGS);

      App.maperial.apply(this.getSettingsConfig());
   }
   
   MapCreationController.closeSettings = function(){

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
      
      addLayer: function(router, event){
         MapCreationController.addLayer();
      },
   });

   //==================================================================//

})();