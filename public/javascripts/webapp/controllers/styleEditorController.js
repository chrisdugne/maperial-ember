
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
         config.styles = [];
         config.styles[0] = App.stylesData.selectedStyle;

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
      config.hud["StyleManager"] = {show : true, type : "panel", visibility : "mandatory" };

      // mapEditor tools
      config.hud[MapParameters.LATLON]        = {show : false, type : "panel",    visibility : "option", label : "Lat/Lon" };
      config.hud[MapParameters.GEOLOC]        = {show : true,  type : "panel",    visibility : "option", label : "Location" };
      config.hud[MapParameters.DETAILS_MENU]  = {show : false, type : "trigger",  visibility : "option", label : "Style Details" };
      config.hud[MapParameters.QUICK_EDIT]    = {show : true,  type : "trigger",  visibility : "option", label : "Quick Style Edit" };
      config.hud[MapParameters.ZOOMS]         = {show : false, type : "trigger",  visibility : "option", label : "Zooms" };
      config.hud[MapParameters.MAGNIFIER]     = {show : true,  type : "trigger",  visibility : "option", label : "Magnifier" };
      config.hud[MapParameters.COLOR_BAR]     = {show : false, type : "trigger",  visibility : "option", label : "ColorBar" };

      config.map.resizable = true;
            
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

