
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

         App.user.set("waiting", false)
         App.mapnify.apply(config);
      });
   }

   StyleEditorController.cleanUI = function()
   {

   }

   //-----------------------------------------------------------------//

   StyleEditorController.getMapEditorConfig = function(){
   
      var config = {hud:[], map:{}};
      
      // mapCreation.styleAndColorbar
      config.hud["StyleManager"] = {show : true, type : HUD.PANEL, visibility : HUD.REQUIRED };

      // mapEditor tools
      config.hud[HUD.LATLON]        = {show : false, type : HUD.PANEL,    visibility : HUD.OPTION, label : "Lat/Lon" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    visibility : HUD.OPTION, label : "Location" };
      config.hud[HUD.DETAILS_MENU]  = {show : false, type : HUD.TRIGGER,  visibility : HUD.OPTION, label : "Style Details" };
      config.hud[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  visibility : HUD.OPTION, label : "Quick Style Edit" };
      config.hud[HUD.ZOOMS]         = {show : false, type : HUD.TRIGGER,  visibility : HUD.OPTION, label : "Zooms" };
      config.hud[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  visibility : HUD.OPTION, label : "Magnifier" };
      config.hud[HUD.COLOR_BAR]     = {show : false, type : HUD.TRIGGER,  visibility : HUD.OPTION, label : "ColorBar" };

      config.map.resizable = true;
      config.edition = HUD.REQUIRED;

      config.styles = [];
      config.styles[0] = App.stylesData.selectedStyle;
      
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

