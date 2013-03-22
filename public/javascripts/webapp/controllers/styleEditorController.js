
(function() {
   'use strict';

   //==================================================================//

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      App.user.set("waiting", true);

      //-----------------------------
      // if creating a new style : copy the selected style as a new style
      if(!App.stylesData.editingStyle)
      {
         var newStyle = {
               name : "CopyOf" + App.stylesData.selectedStyle.name,
               content : App.stylesData.selectedStyle.content,
               uid  : App.stylesData.selectedStyle.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
         };

         App.stylesData.set("selectedStyle", newStyle);
      }

      App.user.set("waiting", false);
      App.maperial.apply(StyleEditorController.getMapEditorConfig());
   }

   StyleEditorController.cleanUI = function()
   {

   }

   //-----------------------------------------------------------------//

   StyleEditorController.getMapEditorConfig = function(){

      var config = {hud:{elements:{}, options:{}}};
      config.edition = true;

      // mapCreation.styleAndColorbar
      config.hud.elements["StyleManager"] = {show : true, type : HUD.PANEL, disableHide : true, disableDrag : true };

      // mapEditor tools
      // maperial hud
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    label : "Controls" };
      config.hud.elements[HUD.LATLON]        = {show : true,  type : HUD.PANEL,    label : "Lat/Lon" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    label : "Location" };
      config.hud.elements[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  label : "Quick Edition" };
      config.hud.elements[HUD.DETAILS_MENU]  = {show : false, type : HUD.TRIGGER,  label : "Style Details" };
      config.hud.elements[HUD.ZOOMS]         = {show : false, type : HUD.TRIGGER,  label : "Zooms" };
      config.hud.elements[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  label : "Magnifier" };

      config.hud.options["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud.options["margin-bottom"] = App.Globals.FOOTER_HEIGHT;

      config.layers = 
         [{ 
            type: LayersManager.Vector, 
            source: {
               type: Source.MaperialOSM
            },
            params: {
               styles: [App.stylesData.selectedStyle.uid],
               selectedStyle: 0,
               group : 0 
            }
         }];

      return config;
   }  

   //==================================================================//
   // Controls
   //------------------------------------------------//

   StyleEditorController.saveStyle = function()
   {
      App.stylesData.set('selectedStyle.name', $("#styleNameInput").val());

      if(App.stylesData.editingStyle)
         StyleManager.saveStyle(App.stylesData.selectedStyle);
      else
         StyleManager.uploadNewStyle(App.stylesData.selectedStyle);
   }

   //------------------------------------------------//

   App.StyleEditorController = StyleEditorController;

   //==================================================================//
   // Routing

   App.StyleEditorRouting = Ember.Route.extend({
      route: '/styleEditor',

      connectOutlets: function(router) {
         App.Router.openPage(router, "styleEditor");
      },

      //--------------------------------------//
      // actions

   });

   //==================================================================//

})();

