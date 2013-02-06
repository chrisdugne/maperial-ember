
(function() {
   'use strict';

   var ColorbarEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   ColorbarEditorController.renderUI = function()
   {

      ScriptLoader.getScripts(["assets/javascripts/extensions/mapeditortools/mapEditor.js"], function(){
         //-----------------------------
         // if creating a new colorbar : copy the selected colorbar as a new colorbar
         if(!App.colorbarsData.editingColorbar)
         {
            var newColorbar = {
                  name : "CopyOf" + App.colorbarsData.selectedColorbar.name,
                  content : App.colorbarsData.selectedColorbar.content,
                  uid  : App.colorbarsData.selectedColorbar.uid // the uid will we overidden after the save call. The copied one is used here to get content + thumb 
            };

            App.colorbarsData.set("selectedColorbar", newColorbar);
         }

         App.stylesData.set("selectedStyle", App.publicData.styles[0]);

         //-----------------------------
         // retrieve the colorbar content from the tileServer
         ColorbarManager.getColorbar(App.colorbarsData.selectedColorbar.uid, function(){

            //-----------------------------
            // retrieve the style content from the tileServer
            StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){
               //-----------------------------
               // rendering after reception

               ColorbarEditorController.mapEditor = new MapEditor(App.stylesData.selectedStyle, App.colorbarsData.selectedColorbar);
               ColorbarEditorController.mapEditor.renderUI();

               App.user.set("waiting", false);
            });
         });
      });
   }

   ColorbarEditorController.cleanUI = function()
   {
      ColorbarEditorController.mapEditor.cleanUI();
   }


// ==================================================================//
// Controls
// ------------------------------------------------//

   ColorbarEditorController.saveColorbar = function()
   {
      var colorbarContent = {};
      ExtensionColorbar.fillContent(colorbarContent);

      App.colorbarsData.set('selectedColorbar.name', $("#colorbarNameInput").val());
      App.colorbarsData.set('selectedColorbar.content', colorbarContent);

      if(App.colorbarsData.editingColorbar)
         ColorbarManager.saveColorbar(App.colorbarsData.selectedColorbar);
      else
         ColorbarManager.uploadNewColorbar(App.colorbarsData.selectedColorbar);
   }

// ------------------------------------------------//

   App.ColorbarEditorController = ColorbarEditorController;

// ==================================================================//
// Routing

   App.ColorbarEditorRouting = Ember.Route.extend({
      route: '/colorbarEditor',

      connectOutlets: function(router) {
         App.Router.openPage(router, "colorbarEditor");
      },

      //--------------------------------------//
      // actions

   });

// ==================================================================//

})();

