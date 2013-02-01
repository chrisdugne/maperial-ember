
(function() {
   'use strict';

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      App.user.set("waiting", true);

      ScriptLoader.getScripts([
                         // map rendering
                         "assets/javascripts/libs/gl-matrix-min.js",
                         "assets/javascripts/libs/jquery.mousewheel.min.js",
                         "assets/javascripts/extensions/maprendering/gl-map-parameters.js",
                         "assets/javascripts/extensions/maprendering/gl-tools.js",
                         "assets/javascripts/extensions/maprendering/coordinate-system.js",
                         "assets/javascripts/extensions/maprendering/render-line.js",
                         "assets/javascripts/extensions/maprendering/render-text.js",
                         "assets/javascripts/extensions/maprendering/tileRenderer.js",
                         "assets/javascripts/extensions/maprendering/gl-map.js",

                         // map editing
                         "assets/javascripts/extensions/mapeditortools/v_colortool.js",
                         "assets/javascripts/extensions/mapeditortools/v_symbolizer.js",
                         "assets/javascripts/extensions/mapeditortools/colorpicker.js",
                         "assets/javascripts/extensions/mapeditortools/RGBColor.js",

                         // style
                         "assets/javascripts/extensions/style/styleMenu.js"],
          function()
          {
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
   
            //-----------------------------
            // retrieve the content from the tileServer
            StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){
               //-----------------------------
               // rendering after reception
   
               StyleEditorController.renderMap();
               StyleEditorController.renderStyle();
               $(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);

               // screen is ready
               App.user.set("waiting", false);
            });
          }
      );
   }

   StyleEditorController.cleanUI = function()
   {
      StyleEditorController.cleanStyle();
      StyleEditorController.cleanMap();
   }

   //------------------------------------------------//

   StyleEditorController.renderMap = function()
   {
      App.stylesData.map = new GLMap ( "map", "magnifier" );
      App.stylesData.map.Start();

      var popupTop = 160;
      
      if(App.user.isCreatingANewMap)
      {
         $("#map").css("height",  $("#webappDiv").height() - 100 );
         $("#map").css("width", $("#webappDiv").width() );
         $("#map").css("margin-top", -62 );
         $("#map").css("margin-left", -20 );
         
         popupTop += 120;
      }
      else
      {
         $("#map").css("height", $("#webappDiv").height() );
      }
      
      $("#magnifier").dialogr({
         width:220,
         minWidth:220,
         height:250,
         minHeight:250,
         position : [$("#webappDiv").width() - 300, popupTop],
         closeOnEscape: false,
         dialogClass: 'no-close'
      });

   }

   StyleEditorController.cleanMap = function()
   {
      $("#map").remove();
      $("#magnifier").remove();
   }

   //------------------------------------------------//

   StyleEditorController.renderStyle = function()
   {
      var popupTop = 160;

      if(App.user.isCreatingANewMap)
      {
         popupTop += 120;
      }
      
      $("#style").dialogr({
         width:460,
         minWidth:460,
         height:590,
         position : [15, popupTop],
         closeOnEscape: false,
         dialogClass: 'no-close'
      });

      // set the menu up
      StyleMenu.init($("#mapEditorTree") , $("#mapEditorWidget") , false , App.stylesData.map , App.stylesData.selectedStyle.content);
   }

   StyleEditorController.cleanStyle = function()
   {
      $("#style").remove();
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

