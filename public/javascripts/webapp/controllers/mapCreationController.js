
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
   }

   MapCreationController.terminate = function ()
   {
      App.user.set("isCreatingANewMap", false);  
   }
   
   //-----------------------------------------//

   MapCreationController.renderDatasetSelectionUI = function()
   {
         ScriptLoader.getScripts([
                         //-- extension.upload
                         "assets/javascripts/extensions/upload/jquery.fileupload.js",
                         "assets/javascripts/extensions/upload/main.js"
                         ],
               function(){
                  ExtensionUpload.init();
               }
         );
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
   }
   
   MapCreationController.cleanStyleAndColorbarUI = function()
   {
      App.StyleEditorController.cleanUI();
      MapCreationController.styleAndColorbarUIReady = false;
   }
   
   
   //==================================================================//
   // Controls

   MapCreationController.wizardSetView = function(view)
   {
      var isViewDatasetSelection = view == "datasetSelection";
      var isViewStyleAndColorbar = view == "styleAndColorbar";
      var isViewGeneration = view == "generation";
      
      App.Globals.set("isViewDatasetSelection", isViewDatasetSelection);
      App.Globals.set("isViewStyleAndColorbar", isViewStyleAndColorbar);
      App.Globals.set("isViewGeneration", isViewGeneration);   
   }
   
   // --------------------- 
   // --- dataset selection

   MapCreationController.openDatasetSelection = function(){
      App.get('router').transitionTo("mapCreation.datasetSelection");
      MapCreationController.wizardSetView("datasetSelection");
   }

   // --------------------- 
   // --- style selection
   
   MapCreationController.selectStyle = function(style){
      App.stylesData.set("selectedStyle", style);
   }
   
   // store the selectedStyle and close the popup
   MapCreationController.changeStyle = function()  {
      MapCreationController.currentStyle = App.stylesData.selectedStyle;
      $("#selectStyleWindow").modal("hide");
   }

   MapCreationController.openStyleSelection = function()
   {
      MapCreationController.wizardSetView("styleAndColorbar");
      
      App.StylesController.openStyleSelectionWindow();
      App.get('router').transitionTo('mapCreation.styleAndColorbar.publicStyles');

      $('#selectStyleWindow').off('hidden');
      $('#selectStyleWindow').on('hidden', function () {
         // if the user dismissed : cancel
         // if he's validated : refreshMap has refreshed MapCreationController.currentStyle
         App.stylesData.set("selectedStyle", MapCreationController.currentStyle);
         
         if(MapCreationController.styleAndColorbarUIReady){
            MapCreationController.refreshMap();
         }
         else{
            App.StyleEditorController.renderUI();
            MapCreationController.styleAndColorbarUIReady = true;
         }
      })
   }

   MapCreationController.refreshMap = function()  
   {
      // retrieve the content from the tileServer
      StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){

         // rendering after reception
         App.stylesData.map.GetParams().SetStyle(App.stylesData.selectedStyle); 
         App.stylesData.map.DrawScene(false, true);

         // screen is ready
         App.user.set("waiting", false);
      });
   }

   // --------------------- 
   // --- generation

   MapCreationController.openGeneration = function(){
      App.get('router').transitionTo("mapCreation.generation");
      MapCreationController.wizardSetView("generation");
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
         route: '/datasetSelection',
         connectOutlets: function(router) {
            var customContext = new Object();
            customContext["datasetsData"] = App.datasetsData; // datasetsData required in datasetList
            App.Router.openComponent(router, "mapCreation", customContext);
         },
      
         //---------------------//
         // state actions
         
         // ---- upload actions
         startUpload: function(router, event){
            App.DatasetsController.startUpload(event.context);
         },

         cancelUpload: function(router, event){
            App.DatasetsController.removeUpload(event.context);
         },

         removeUpload: function(router, event){
            App.DatasetsController.removeUpload(event.context);
         },
         
         openUploadWindow: function(){App.DatasetsController.openUploadWindow()}
         // ---- 

      }),


      styleAndColorbar: Ember.Route.extend({
         route: '/styleAndColorbar',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "mapCreation");
         },

         //--------------------------------------//
         // states
   
         myStyles: Ember.Route.extend({
            route: '/myStyles',
            connectOutlets: function(router) {
               var customParams = [];
               customParams["styles"] = App.user.styles;
               customParams["stylesData"] = App.stylesData;
               App.Router.openComponent(router, "styleAndColorbar", customParams);
            }
         }),
   
         publicStyles: Ember.Route.extend({
            route: '/publicStyles',
            connectOutlets: function(router) {
               var customParams = [];
               customParams["styles"] = App.publicData.styles;
               customParams["stylesData"] = App.stylesData;
               App.Router.openComponent(router, "styleAndColorbar", customParams);
            }
         }),


         //---------------------//
         // state actions
         
         // ---- select style actions
         showPublicStyles: Ember.Route.transitionTo('mapCreation.styleAndColorbar.publicStyles'),
         showMyStyles: Ember.Route.transitionTo('mapCreation.styleAndColorbar.myStyles'),
   
         selectStyle : function(router, event){
            console.log("calling MapCreationController.selectStyle with " + event.context.name);
            MapCreationController.selectStyle(event.context);
         }
         // -----
      }),
      
      generation: Ember.Route.extend({
         route: '/generation',
         connectOutlets: function(router) {
            App.Router.openComponent(router, "mapCreation");
         }
      }),
      
      //--------------------------------------//
      // actions
      
      //--- wizard
      openDatasetSelection: Ember.Route.transitionTo('mapCreation.datasetSelection'),
      openStyleAndColorbar: Ember.Route.transitionTo('mapCreation.styleAndColorbar'),
      openGeneration: Ember.Route.transitionTo('mapCreation.generation')
      // ---- 
   });

   //==================================================================//

})();