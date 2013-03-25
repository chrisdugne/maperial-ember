
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
      $(window).on(MaperialEvents.READY, MapCreationController.maperialReady);
      
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayers();
   }
   
   MapCreationController.terminate = function ()
   {
      $(window).off(MaperialEvents.READY, MapCreationController.maperialReady);
      App.user.set("isCreatingANewMap", false);  
   }
   
   //==================================================================//

   MapCreationController.maperialReady = function (){
      App.layerSetsHelper.refreshLayersPanel();
      MapCreationController.defaultStyleSelection();
   }

   // init : once maperial is ready, getSelectedStyle is also the selected one in the styleSelectionWindow
   MapCreationController.defaultStyleSelection = function (){
      console.log("MapCreationController.setNewStyle");
      App.stylesData.set("selectedStyle", App.maperial.stylesManager.getSelectedStyle());
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
      config.hud.elements["Layers"] = {show : true, type : HUD.PANEL, position : { right: "0", top: "0"}, disableHide : true, disableDrag : true };

      // maperial hud
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    label : "Location" };
      
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
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    label : "Location" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      return config;
   }  

   //=============================================================================//
   // --- layer view

   MapCreationController.openLayers = function()
   {
      App.maperial.apply(MapCreationController.getLayersCreationConfig());
   }

   MapCreationController.backToLayers = function(){
      MapCreationController.closeSettings();
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayers();
   }

   //=============================================================================//
   // Layers
   
   MapCreationController.openSourceSelection = function(){
      $("#sourceSelectionWindow").modal();
   }
   
   //--------------------------------------//

   MapCreationController.addLayer = function(sourceType){
      $("#sourceSelectionWindow").modal("hide");
      
      switch(sourceType){
         
         case Source.MaperialOSM:
            MapCreationController.addOSMLayer();
            break;

         case Source.Raster:
            MapCreationController.openSelectRasterWindow();
            break;
            
      }
   }

   //--------------------------------------//

   MapCreationController.addOSMLayer = function(){
      if(App.maperial.config.layers.length > 0 
      && App.maperial.config.layers[App.maperial.config.layers.length-1].source.type == Source.MaperialOSM){
         // TODO :  ameliorer le UI avec bootstrap.alert
         alert("Le layer du dessus est deja OSM");
      }
      else{
         App.maperial.layersManager.addLayer(Source.MaperialOSM);
      }
   }
   
   //--------------------------------------//

   MapCreationController.editLayer = function(layerIndex){
      
      if(MapCreationController.preventNextEdit){
         return;
      }
         
      var layer = App.maperial.config.layers[layerIndex];
      
      switch(layer.source.type){
         case Source.MaperialOSM :
            MapCreationController.openSelectStyleWindow();
            break;

         case Source.Raster :
            MapCreationController.openSelectRasterWindow();
            break;
      }
   }

   //--------------------------------------//
   
   MapCreationController.customizeLayer = function(layerIndex){

      var layer = App.maperial.config.layers[layerIndex];
      
      switch(layer.source.type){
         case Source.MaperialOSM :
            MapCreationController.openCustomizeLayerSetsWindow(layerIndex);
            break;
            
         case Source.Raster :
            MapCreationController.openSelectRasterWindow();
            break;
      }
   }
   
   //--------------------------------------//
   
   MapCreationController.deleteLayer = function(layerIndex){
      App.maperial.layersManager.deleteLayer(layerIndex);
   }
   
   //=============================================================================//
   // OSM Styles
   
   MapCreationController.openSelectStyleWindow = function(){
      App.get('router').transitionTo('mapCreation.publicStyles');
      $("#selectStyleWindow").modal();
      $('#selectStyleWindow').off('hidden');
      $('#selectStyleWindow').on('hidden', MapCreationController.defaultStyleSelection);
   }

   MapCreationController.selectStyle = function(style){
      App.stylesData.set("selectedStyle", style);
   }

   //** called from StylesController.changeStyle()... 
   MapCreationController.changeStyle = function(){
      App.maperial.changeStyle(App.stylesData.selectedStyle.uid);
      $("#selectStyleWindow").modal("hide");
   }

   //=============================================================================//
   // OSM Groups
   
   MapCreationController.openCustomizeLayerSetsWindow = function(layerIndex){

      $("#customizeLayerSetsWindow").modal();
      console.log("openCustomizeLayerSetsWindow " + layerIndex);
      App.layerSetsHelper.buildLayerSets(layerIndex);
//      $('#selectGroupsWindow').off('hidden');
//      $('#selectGroupsWindow').on('hidden', MapCreationController.defaultStyleSelection);
   }
   
   
   //=============================================================================//
   // Rasters
   
   MapCreationController.openSelectRasterWindow = function(){
      $("#selectRasterWindow").modal();
   }
   
   MapCreationController.selectRaster = function(raster){
      console.log(raster);
      $("#selectRasterWindow").modal("hide");
      App.maperial.layersManager.addLayer(Source.Raster, [raster.uid]);
   }
   
   //=============================================================================//
   // --- settings view

   MapCreationController.openSettings = function(){
      MapCreationController.wizardSetView(MapCreationController.SETTINGS);
      App.maperial.apply(this.getSettingsConfig());
   }
   
   MapCreationController.closeSettings = function(){

   }

   //=============================================================================//

   App.MapCreationController = MapCreationController;
   App.layerSetsHelper = new LayerSetsHelper(App.maperial, App.MapCreationController);

   //==================================================================//
   // Routing

   App.MapCreationRouting = Ember.Route.extend({
      route: '/mapCreation',

      connectOutlets: function(router){
         var customContext = new Object();
         customContext["datasetsData"] = App.datasetsData; // datasetsData required in rasterList
         App.Router.openPage(router, "mapCreation", customContext);
      },
   
      //--------------------------------------//
      // styles states

      myStyles: Ember.Route.extend({
         route: '/',
         connectOutlets: function(router) {
            var customParams = [];
            customParams["styles"] = App.user.styles;
            customParams["stylesData"] = App.stylesData;
            App.Router.openComponent(router, "mapCreation", customParams);
         }
      }),

      publicStyles: Ember.Route.extend({
         route: '/',
         connectOutlets: function(router) {
            var customParams = [];
            customParams["styles"] = App.publicData.styles;
            customParams["stylesData"] = App.stylesData;
            App.Router.openComponent(router, "mapCreation", customParams);
         }
      }),
      
      //---------------------//
      // styles actions

      showPublicStyles: Ember.Route.transitionTo('mapCreation.publicStyles'),
      showMyStyles: Ember.Route.transitionTo('mapCreation.myStyles'),

      selectStyle : function(router, event){
         MapCreationController.selectStyle(event.context);
      },

      changeStyle : function(router, event){
         MapCreationController.changeStyle();
      },

      //---------------------//
      // layers actions
      
      openSourceSelection: function(router, event){
         MapCreationController.openSourceSelection();
      },
      
      addLayer: function(router, event){
         var source = event.context;
         MapCreationController.addLayer(source);
      },
      
      //--------------------------------------//
      // raster actions
      
      selectRaster: function(router, event){
         var raster = event.context;
         MapCreationController.selectRaster(raster);
      },
   });

   //==================================================================//

})();