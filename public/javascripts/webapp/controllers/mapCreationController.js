
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
      $(window).on(MaperialEvents.READY, MapCreationController.maperialReady);

      App.user.set("isCreatingANewMap", (App.user.selectedMap.uid == null));

      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayersCreation();
   }
   
   MapCreationController.terminate = function ()
   {
      $(window).off(MaperialEvents.READY, MapCreationController.maperialReady);
      App.user.set("isCreatingANewMap", false);  
      App.user.set("selectedMap", null);  
   }
   
   //==================================================================//

   MapCreationController.maperialReady = function (){
      App.layerSetsHelper.refreshLayersPanel();
      MapCreationController.setSelectedStyle();
   }

   // init : once maperial is ready, getSelectedStyle is also the selected one in the styleSelectionWindow
   MapCreationController.setSelectedStyle = function (){
      console.log("MapCreationController.setSelectedStyle");
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
      config.hud.elements[HUD.COMPOSITIONS]  = {show : true,  type : HUD.PANEL,    disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : false, type : HUD.PANEL,    label : "Controls", disableDrag : true };
      config.hud.elements[HUD.SCALE]         = {show : false, type : HUD.PANEL,    label : "Scale" };
      config.hud.elements[HUD.GEOLOC]        = {show : false, type : HUD.PANEL,    label : "Location" };
      
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
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    label : "Controls", disableDrag : true };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    label : "Location" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      return config;
   }  

   //=============================================================================//
   // Map controls

   MapCreationController.saveMap = function()
   {
      App.user.set('selectedMap.name', $("#mapNameInput").val());
      App.user.set('selectedMap.config', App.maperial.config);
      
      if(App.user.isCreatingANewMap)
         App.mapManager.uploadNewMap(App.user.selectedMap);
      else
         App.mapManager.saveMap(App.user.selectedMap);
   }
   
   //=============================================================================//
   // --- layer view

   MapCreationController.openLayersCreation = function()
   {
      if(App.user.isCreatingANewMap){
         App.maperial.apply(MapCreationController.getLayersCreationConfig());
         MapCreationController.openBaseSelection();
      }
      else{
         App.maperial.apply(App.user.selectedMap.config);
      }
   }

   MapCreationController.backToLayers = function(){
      MapCreationController.closeSettings();
      MapCreationController.wizardSetView(MapCreationController.LAYERS_CREATION);
      MapCreationController.openLayersCreation();
   }

   //=============================================================================//
   // Layers
   
   MapCreationController.openBaseSelection = function(){
      $("#baseSelectionWindow").modal();
      $('#baseSelectionWindow').off('hidden');
      $('#baseSelectionWindow').on('hidden', function(){
         setTimeout(function(){
            if(App.maperial.config.layers.length == 0)
               MapCreationController.openBaseSelection()
         }, 200);
      });
   }

   //--------------------------------------//

   MapCreationController.openSourceSelection = function(){
      $("#sourceSelectionWindow").modal();
      
      MapCreationController.currentLayerIndex = -1;
   }
   
   //--------------------------------------//

   MapCreationController.addLayer = function(sourceType, imagesSrc){
      $("#baseSelectionWindow").modal("hide");
      $("#sourceSelectionWindow").modal("hide");
      
      switch(sourceType){
         
         case Source.MaperialOSM:
            MapCreationController.addOSMLayer();
            break;

         case Source.Raster:
            MapCreationController.openSelectRasterWindow();
            break;

         case Source.Images:
            MapCreationController.addImagesLayer(imagesSrc);
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
   
   MapCreationController.addImagesLayer = function(src){
      var yetAnotherImagesLayer = false;
      
      for(var i = 0; i < App.maperial.config.layers.length; i++){
         if(App.maperial.config.layers[i].type == Source.Images){
            yetAnotherImagesLayer = true;
            break;
         }
      }
      
      if(yetAnotherImagesLayer){
         // TODO :  ameliorer le UI avec bootstrap.alert
         alert("Il y a deja un layer 'Images'");
      }
      else{
         App.maperial.layersManager.addLayer(Source.Images, [src]);
      }
   }
   
   //--------------------------------------//

   MapCreationController.editLayer = function(layerIndex){
      
      if(MapCreationController.preventNextEdit){
         // mouseUp when dragging layer arrives here : not a click : prevent this call.
         return;
      }
         
      var layer = App.maperial.config.layers[layerIndex];
      MapCreationController.currentLayerIndex = layerIndex;
      
      switch(layer.source.type){
         case Source.MaperialOSM :
            MapCreationController.openSelectStyleWindow();
            break;

         case Source.Raster :
            MapCreationController.openSelectRasterWindow();
            break;
            
         case Source.Images:
            MapCreationController.openSelectImagesWindow();
            break;
            
      }
   }

   //--------------------------------------//
   
   MapCreationController.customizeLayer = function(layerIndex){
      var layer = App.maperial.config.layers[layerIndex];
      MapCreationController.currentLayerIndex = layerIndex;
      MapCreationController.openCustomizeLayerWindow(layer);
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
      $('#selectStyleWindow').on('hidden', MapCreationController.setSelectedStyle);
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
   // Customize 
   
   MapCreationController.openCustomizeLayerWindow = function(layer){

      console.log("customize layer " + MapCreationController.currentLayerIndex);

      switch(layer.source.type){

         case Source.MaperialOSM :
            $("#customizeLayerOSMWindow").modal();
            App.layerSetsHelper.buildLayerSets(MapCreationController.currentLayerIndex);
            break;
            
         case Source.Raster :
         case Source.Images:
            $("#customizeLayerWindow").modal();
            break;
            
      }

      App.layerSetsHelper.buildCompositionOptions(MapCreationController.currentLayerIndex);
   }
   
   //=============================================================================//
   // Rasters
   
   MapCreationController.openSelectRasterWindow = function(){
      $("#selectRasterWindow").modal();
   }
   
   MapCreationController.selectRaster = function(raster){
      $("#selectRasterWindow").modal("hide");
      
      if(MapCreationController.currentLayerIndex >= 0){
         console.log("editing a raster");
         App.maperial.layersManager.changeRaster(MapCreationController.currentLayerIndex, raster.uid);
      }
      else{
         console.log("adding a new raster");
         App.maperial.layersManager.addLayer(Source.Raster, [raster.uid]);
      }
   }
   
   //=============================================================================//
   // Images
   
   MapCreationController.openSelectImagesWindow = function(){
      $("#selectImagesWindow").modal();
   }
   
   MapCreationController.selectImages = function(src){
      $("#selectImagesWindow").modal("hide");
      console.log("editing images");
      App.maperial.layersManager.changeImages(MapCreationController.currentLayerIndex, src);
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
         var source = event.contexts[0];
         var imagesSrc = event.contexts[1];
         MapCreationController.addLayer(source, imagesSrc);
      },

      saveMap: function(router, event){
         MapCreationController.saveMap();
      },
      
      //--------------------------------------//
      // raster actions
      
      selectRaster: function(router, event){
         var raster = event.context;
         MapCreationController.selectRaster(raster);
      },

      //--------------------------------------//
      // images actions
      
      selectImages: function(router, event){
         var src = event.context;
         MapCreationController.selectImages(src);
      },
   });

   //==================================================================//

})();