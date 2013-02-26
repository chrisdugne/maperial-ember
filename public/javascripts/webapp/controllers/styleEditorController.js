
(function() {
   'use strict';

   //==================================================================//

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      ScriptLoader.getScripts(["assets/javascripts/extensions/mapeditortools/map-editor.js"], function(){

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

         App.mapEditor.reset(App.stylesData.selectedStyle, null, StyleEditorController.getMapEditorConfig());
         
         App.Globals.set("currentMapEditor", StyleEditorController.mapEditor);
      });

      App.resizeWindow();
   }

   StyleEditorController.cleanUI = function()
   {
      
   }

   //-----------------------------------------------------------------//s
   
   StyleEditorController.getMapEditorConfig = function(){

      var config = {
            // mapCreation.styleAndColorbar
            "StyleEditorMenu" : {show : true, type : "panel", visibility : "mandatory" },

            // mapEditor tools
            "LatLon"       : {show : false, type : "panel",    visibility : "option", label : "Lat/Lon" },
            "Geoloc"       : {show : true,  type : "panel",    visibility : "option", label : "Location" },
            "DetailsMenu"  : {show : false, type : "trigger",  visibility : "option", label : "Style Details" },
            "QuickEdit"    : {show : true,  type : "trigger",  visibility : "option", label : "Quick Style Edit" },
            "Zooms"        : {show : false, type : "trigger",  visibility : "option", label : "Zooms" },
            "Magnifier"    : {show : true,  type : "trigger",  visibility : "option", label : "Magnifier" },
            "ColorBar"     : {show : false, type : "trigger",  visibility : "option", label : "ColorBar" }
      };
      
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

