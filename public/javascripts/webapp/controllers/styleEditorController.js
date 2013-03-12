
(function() {
   'use strict';

   //==================================================================//

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      App.user.set("waiting", true);
      App.refreshSizes();

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

      //-----------------------------
      // retrieve the content from the tileServer
      StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){

         var config = StyleEditorController.getMapEditorConfig();

         App.user.set("waiting", false);
         App.maperial.apply(config);
      });
   }

   StyleEditorController.cleanUI = function()
   {

   }

   //-----------------------------------------------------------------//

   StyleEditorController.getMapEditorConfig = function(){
   
      var config = {hud:[], map:{}};
      
      // mapCreation.styleAndColorbar
      config.hud["StyleManager"] = {show : true, type : HUD.PANEL, isOption : false };

      // mapEditor tools
      config.hud[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud[HUD.LATLON]        = {show : false, type : HUD.PANEL,    isOption : true, label : "Lat/Lon" };
      config.hud[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud[HUD.MAPKEY]        = {show : false, type : HUD.PANEL,    isOption : true, label : "Map Key" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      config.hud[HUD.DETAILS_MENU]  = {show : false, type : HUD.TRIGGER,  isOption : true, label : "Style Details" };
      config.hud[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Quick Style Edit" };
      config.hud[HUD.ZOOMS]         = {show : false, type : HUD.TRIGGER,  isOption : true, label : "Zooms" };
      config.hud[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Magnifier" };
      config.hud[HUD.COLOR_BAR]     = {show : false, type : HUD.TRIGGER,  isOption : true, label : "ColorBar" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      config.edition = true;
      config.map.resizable = true;

      config.styles = [];
      config.styles[0] = App.stylesData.selectedStyle.content;
      
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

