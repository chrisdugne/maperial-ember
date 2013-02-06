
(function() {
   'use strict';

   //==================================================================//

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      ScriptLoader.getScripts(["assets/javascripts/extensions/mapeditortools/mapEditor.js"], function(){

         //-----------------------------
         // if creating a new style : copy the selected style as a new style
         if(!App.stylesData.editingStyle)
         {
            console.log("Creating a new style");
            var newStyle = {
                  name : "CopyOf" + App.stylesData.selectedStyle.name,
                  content : App.stylesData.selectedStyle.content,
                  uid  : App.stylesData.selectedStyle.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
            };
            console.log(newStyle.name);

            App.stylesData.set("selectedStyle", newStyle);
         }

         StyleEditorController.mapEditor = new MapEditor(App.stylesData.selectedStyle, null);
         StyleEditorController.mapEditor.renderUI();

      });
   }

   StyleEditorController.cleanUI = function()
   {
      StyleEditorController.mapEditor.cleanUI();
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

