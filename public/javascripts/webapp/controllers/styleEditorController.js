
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
                         "assets/javascripts/extensions/maprendering/coordinate-system.js",
                         "assets/javascripts/extensions/maprendering/gl-map-parameters.js",
                         "assets/javascripts/extensions/maprendering/gl-tools.js",
                         "assets/javascripts/extensions/maprendering/gl-rasterlayer.js",
                         "assets/javascripts/extensions/maprendering/gl-tile.js",
                         "assets/javascripts/extensions/maprendering/gl-vectoriallayer.js",
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
      var cbData = [];
      
      cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );
      for (var i = 1 ; i < 256 ; i = i + 1) {
         cbData.push ( i );cbData.push ( 0 );cbData.push ( 255-i );cbData.push ( 255 );
      }
      
      console.log (cbData ) 
      App.stylesData.map = new GLMap ( "map", "magnifier" );
      App.stylesData.map.GetParams().SetStyle(App.stylesData.selectedStyle.content);
      App.stylesData.map.GetParams().SetColorBar(cbData)
      App.stylesData.map.Start (); 

      $("#map").css("height", $("#webappDiv").height() );
      $("#map").css("width", $("#webappDiv").width() );
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

      // set the menu up
      StyleMenu.init($("#mapnifyMenu") , $("#mapnifyWidget") , $("#mapnifyZoom") , false , App.stylesData.map , App.stylesData.selectedStyle.content);
      
      $(".trigger").click(function(){
         var name = $(this).context.id.replace("trigger","");
         $("#panel"+name).toggle("fast");
         $(this).toggleClass("active");
         return false;
      });

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

