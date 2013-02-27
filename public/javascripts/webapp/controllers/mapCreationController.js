
(function() {
   'use strict';

   var MapCreationController = Ember.ObjectController.extend({});

   //==================================================================//
   // Rendering
   
   MapCreationController.init = function()
   {
      App.user.set("isCreatingANewMap", true);
      MapCreationController.wizardSetView("datasetSelection");
      MapCreationController.renderDatasetSelectionUI();
      App.refreshSizes();
   }

   MapCreationController.terminate = function ()
   {
      App.user.set("isCreatingANewMap", false);  
   }
   
   //-----------------------------------------//

   MapCreationController.renderDatasetSelectionUI = function()
   {
      
   }

   MapCreationController.cleanDatasetSelectionUI = function()
   {
      console.log("MapCreationController.cleanDatasetSelectionUI");      
   }
   
   //-----------------------------------------//
   
   MapCreationController.renderStyleAndColorbarUI = function()
   {
      App.stylesData.set("selectedStyle", App.publicData.styles[0]);
      MapCreationController.currentStyle = App.stylesData.selectedStyle;
      MapCreationController.openStyleSelection();
      
      App.refreshSizes();
   }
   
   MapCreationController.cleanStyleAndColorbarUI = function()
   {
      App.mapEditor.cleanUI();
      MapCreationController.styleAndColorbarUIReady = false;
   }
   
   //==================================================================//
   // Controls

   MapCreationController.wizardSetView = function(view)
   {
      var isViewDatasetSelection = view == "datasetSelection";
      var isViewStyleAndColorbar = view == "styleAndColorbar";
      var isViewSettings = view == "settings";
      
      App.Globals.set("isViewDatasetSelection", isViewDatasetSelection);
      App.Globals.set("isViewStyleAndColorbar", isViewStyleAndColorbar);
      App.Globals.set("isViewSettings", isViewSettings);   
   }
   
   // --------------------- 
   // --- dataset selection

   MapCreationController.openDatasetSelection = function(){
      App.get('router').transitionTo("mapCreation.datasetSelection");
      App.datasetsData.set("selectedRaster", undefined);
      MapCreationController.wizardSetView("datasetSelection");
   }

   MapCreationController.selectRaster = function(raster){
      App.datasetsData.set("selectedRaster", raster);
      App.get('router').transitionTo('mapCreation.mapEdition');
   }

   // --------------------- 
   // --- style selection
   
   MapCreationController.selectStyle = function(style){
      App.stylesData.set("selectedStyle", style);
   }
   
   // store the selectedStyle and close the popup
   MapCreationController.changeStyle = function()  {
      MapCreationController.currentStyle = App.stylesData.selectedStyle; // coucou crapaud je t aime tu es beau
      $("#selectStyleWindow").modal("hide");
   }

   MapCreationController.openStyleSelection = function()
   {
      MapCreationController.wizardSetView("styleAndColorbar");

      App.get('router').transitionTo('mapCreation.mapEdition.publicStyles');
      
      $('#selectStyleWindow').modal();
      $('#selectStyleWindow').off('hidden');
      $('#selectStyleWindow').on('hidden', function () {
         // if the user dismissed : cancel
         // if he's validated : refreshMap has refreshed MapCreationController.currentStyle
         App.stylesData.set("selectedStyle", MapCreationController.currentStyle);
         
         /*
          * 
          *  //-----------------------------
            // retrieve the content from the tileServer
            StyleManager.getStyle(mapEditor.style.uid, function(){
      
               if(mapEditor.colorbar){
                  //-----------------------------
                  // retrieve the colorbar content from the tileServer
                  ColorbarManager.getColorbar(mapEditor.colorbar.uid, function(){
      
                     // rendering after reception
                     mapEditor.renderAll(tryGeoloc);
                  });
      
               }
               else{
                  // rendering after reception
                  mapEditor.renderAll(tryGeoloc);
               }
            });
          * 
          */

         if(MapCreationController.styleAndColorbarUIReady){
            MapCreationController.refreshMap();
         }
         else{
            // map rendering !

            if(App.datasetsData.selectedRaster){
               var lat = (App.datasetsData.selectedRaster.latMin + App.datasetsData.selectedRaster.latMax)/2; 
               var lon = (App.datasetsData.selectedRaster.lonMin + App.datasetsData.selectedRaster.lonMax)/2; 
            }
            
            App.mapEditor.reset(App.stylesData.selectedStyle, null, MapCreationController.getConfigStyleAndColorbar(), lat, lon);
            
            MapCreationController.styleAndColorbarUIReady = true;
         }
      })
   }

   //--------------------------------------------------------//
   
   MapCreationController.getConfigStyleAndColorbar = function(){
      var config = {};
      
      // mapCreation.styleAndColorbar
      config["StyleManager"] = {show : true, type : "panel", visibility : "mandatory" };

      // mapEditor tools
      config[MapParameters.LATLON]        = {show : false, type : "panel",    visibility : "option", label : "Lat/Lon" };
      config[MapParameters.GEOLOC]        = {show : true,  type : "panel",    visibility : "option", label : "Location" };
      config[MapParameters.DETAILS_MENU]  = {show : false, type : "trigger",  visibility : "option", label : "Style Details" };
      config[MapParameters.QUICK_EDIT]    = {show : false, type : "trigger",  visibility : "option", label : "Quick Style Edit" };
      config[MapParameters.ZOOMS]         = {show : false, type : "trigger",  visibility : "option", label : "Zooms" };
      config[MapParameters.MAGNIFIER]     = {show : false, type : "trigger",  visibility : "option", label : "Magnifier" };
      config[MapParameters.COLOR_BAR]     = {show : false, type : "trigger",  visibility : "option", label : "ColorBar" };
            
      return config;
   }  

   //--------------------------------------------------------//
   
   MapCreationController.getConfigSettings = function(){
      var config = {};
      
      // mapCreation.mapSettings
      config["MapSettings"] = {show : true, type : "panel", visibility : "mandatory" };

      // mapEditor tools
      config[MapParameters.LATLON]        = {show : false, type : "panel",    visibility : "option", label : "Lat/Lon" };
      config[MapParameters.GEOLOC]        = {show : true,  type : "panel",    visibility : "option", label : "Location" };
      config[MapParameters.DETAILS_MENU]  = "disabled";
      config[MapParameters.QUICK_EDIT]    = "disabled";
      config[MapParameters.ZOOMS]         = {show : false, type : "trigger",  visibility : "option", label : "Zooms" };
      config[MapParameters.MAGNIFIER]     = {show : false, type : "trigger",  visibility : "option", label : "Magnifier" };
      config[MapParameters.COLOR_BAR]     = "disabled";
      
      return config;
   }  

   //--------------------------------------------------------//
   
   MapCreationController.refreshMap = function()  
   {
      // retrieve the content from the tileServer
      StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){

         // rendering after reception
         App.mapEditor.map.GetParams().SetStyle(App.stylesData.selectedStyle); 
         App.mapEditor.map.DrawScene(false, true);

         // screen is ready
         App.user.set("waiting", false);
      });
   }

   MapCreationController.backToStyleAndColorbar = function(){
      MapCreationController.closeSettings();
      MapCreationController.wizardSetView("styleAndColorbar");
      App.mapEditor.changeConfig(this.getConfigStyleAndColorbar());
      App.refreshSizes();
   }
      
   // --------------------- 
   // --- settings

   MapCreationController.openSettings = function(){
      
      MapCreationController.wizardSetView("settings");

      App.mapEditor.changeConfig(this.getConfigSettings());
      App.mapEditor.showBoundingBox();
      App.mapEditor.deactivateBoundingBoxDrawing();

      $("#settings").removeClass("hide");
      $("#buttonMapMode").addClass("active");
      $("#buttonDrawMode").removeClass("active");
      
      $("#triggerSettings").click(function(){
         $("#panelSettings").toggle("fast");
         $(this).toggleClass("active");
         return false;
      });

      $("#buttonMapMode").click(function(){
         $(this).addClass("active");
         $("#buttonDrawMode").removeClass("active");
         $("#buttonCenter").removeClass("hide");
         $("#buttonReset").addClass("hide");
         App.mapEditor.deactivateBoundingBoxDrawing();
         return false;
      });

      $("#buttonDrawMode").click(function(){
         $(this).addClass("active");
         $("#buttonMapMode").removeClass("active");
         $("#buttonCenter").addClass("hide");
         $("#buttonReset").removeClass("hide");
         App.mapEditor.activateBoundingBoxDrawing();
         return false;
      });
      
      $("#buttonCenter").click(function(){
         App.mapEditor.boundingBoxDrawer.center();
         return false;
      });
      
      $("#buttonReset").click(function(){
         App.mapEditor.boundingBoxDrawer.cancelEdition();
         return false;
      });
   }

   MapCreationController.closeSettings = function(){
      App.mapEditor.hideBoundingBox();
      $("#settings").addClass("hide");
      
      $("#triggerSettings").unbind("click");
      $("#buttonMapMode").unbind("click");
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
      // states

      datasetSelection: Ember.Route.extend({
         route: '/datasets',
         connectOutlets: function(router) {
            var customContext = new Object();
            customContext["datasetsData"] = App.datasetsData; // datasetsData required in datasetList
            App.Router.openComponent(router, "mapCreation", customContext);
         }
      }),

      selectRaster : function(router, event){
         MapCreationController.selectRaster(event.context);
      },
      
      //--------------------------------------//

      mapEdition: Ember.Route.extend({
         route: '/style',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "mapCreation");
         },

         //--------------------------------------//
         // states
   
         myStyles: Ember.Route.extend({
            route: '/',
            connectOutlets: function(router) {
               var customParams = [];
               customParams["styles"] = App.user.styles;
               customParams["stylesData"] = App.stylesData;
               App.Router.openComponent(router, "mapEdition", customParams);
            }
         }),
   
         publicStyles: Ember.Route.extend({
            route: '/',
            connectOutlets: function(router) {
               var customParams = [];
               customParams["styles"] = App.publicData.styles;
               customParams["stylesData"] = App.stylesData;
               App.Router.openComponent(router, "mapEdition", customParams);
            }
         }),


         //---------------------//
         // state actions
         
         // ---- select style actions
         showPublicStyles: Ember.Route.transitionTo('mapCreation.mapEdition.publicStyles'),
         showMyStyles: Ember.Route.transitionTo('mapCreation.mapEdition.myStyles'),
   
         selectStyle : function(router, event){
            console.log("calling MapCreationController.selectStyle with " + event.context.name);
            MapCreationController.selectStyle(event.context);
         }
         // -----
      }),
      
      
      //--------------------------------------//
      // actions
      
      //--- wizard
      datasets: Ember.Route.transitionTo('datasets'),
      openDatasetSelection: Ember.Route.transitionTo('mapCreation.datasetSelection'),
      openMapEdition: Ember.Route.transitionTo('mapCreation.mapEdition')
      // ---- 
   });

   //==================================================================//

})();