
//==================================================================//

function MapEditor(style, colorbar, showStyleTriggers, showColorbarTriggers){
   this.map;
   this.style = style;
   this.colorbar = colorbar;
   this.boundingBoxManager;
   this.showStyleTriggers = showStyleTriggers;
   this.showColorbarTriggers = showColorbarTriggers;
}

//==================================================================//

MapEditor.prototype.renderUI = function() {
   
   App.user.set("waiting", true);
   var mapEditor = this; // to have access to 'this' in the callBack

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
                "assets/javascripts/extensions/mapeditortools/fabric.all.1.0.6.js",
                "assets/javascripts/extensions/mapeditortools/boundingBoxManager.js",
                "assets/javascripts/extensions/mapeditortools/v_colortool.js",
                "assets/javascripts/extensions/mapeditortools/v_symbolizer.js",
                "assets/javascripts/extensions/mapeditortools/colorpicker.js",
                "assets/javascripts/extensions/mapeditortools/RGBColor.js",
                "assets/javascripts/extensions/mapeditortools/map.js",
                "assets/javascripts/extensions/mapeditortools/canvasutilities.js",

                // style
                "assets/javascripts/extensions/style/styleMenu.js",

                // colorbar
                "assets/javascripts/extensions/colorbar/colorBar.js",
                "assets/javascripts/extensions/colorbar/main.js"],
          function()
          {
               //-----------------------------
               // retrieve the content from the tileServer
               StyleManager.getStyle(mapEditor.style.uid, function(){
         
                  if(mapEditor.colorbar){
                     //-----------------------------
                     // retrieve the colorbar content from the tileServer
                     ColorbarManager.getColorbar(mapEditor.colorbar.uid, function(){

                           // rendering after reception
                           mapEditor.renderAll();
                     });
                     
                  }
                  else{
                     // rendering after reception
                     mapEditor.renderAll();
                  }
               });
          }
   );
}
 

MapEditor.prototype.renderAll = function(){
   
   this.renderMap();
   this.renderStyle();
   this.renderTriggers();
   
   if(this.colorbar){
      this.renderColorbar();
   }
   
   this.boundingBoxManager = new BoundingBoxManager(this.map);
   
   // screen is ready
   App.user.set("waiting", false);
}


MapEditor.prototype.cleanUI = function(){
   this.cleanStyle();
   this.cleanColorbar();
   this.cleanMap();
}

//------------------------------------------------//

MapEditor.prototype.showBoundingBoxManager = function(){

   this.boundingBoxManager.init("drawBoard", $("#webappDiv").width(), $("#webappDiv").height());
   
   $("#drawBoardContainer").removeClass("hide");
}

MapEditor.prototype.hideBoundingBoxManager = function(){

   $("#drawBoardContainer").addClass("hide");
   
}
   
//------------------------------------------------//

MapEditor.prototype.renderMap = function(){
   
   var cbData = [];
   cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );
   for (var i = 1 ; i < 256 ; i = i + 1) {
      cbData.push ( i );cbData.push ( 0 );cbData.push ( 255-i );cbData.push ( 255 );
   }

   this.map = new GLMap ( "map", "magnifier" );
   this.map.GetParams().SetStyle(this.style.content);
   this.map.GetParams().SetColorBar(cbData)
   this.map.Start(); 

   $("#map").css("width", $("#webappDiv").width() );
   $("#map").css("height", $("#webappDiv").height() - App.Globals.HEADER_HEIGHT ); // on a le header dans la webappdiv !!
}

MapEditor.prototype.cleanMap = function(){
   $("#map").remove();
   $("#magnifier").remove();
}

//------------------------------------------------//

MapEditor.prototype.hideTriggers = function(){
   
   $('.trigger').unbind('click');

   $("#commonTriggers").addClass("hide");
   $("#styleEditorTriggers").addClass("hide");
   $("#styleEditorManagement").addClass("hide");
   $("#colorbarEditorTriggers").addClass("hide");
   $("#colorbarEditorManagement").addClass("hide");
   
}

MapEditor.prototype.renderTriggers = function(){
   
   $(".trigger").click(function(){
      var name = $(this).context.id.replace("trigger","");
      $("#panel"+name).toggle("fast");
      $(this).toggleClass("active");
      return false;
   });

   $("#commonTriggers").removeClass("hide");

   if(this.showStyleTriggers){
      $("#styleEditorTriggers").removeClass("hide");
      $("#styleEditorManagement").removeClass("hide");
   }
   
   if(this.showColorbarTriggers){
      $("#colorbarEditorTriggers").removeClass("hide");
      $("#colorbarEditorManagement").removeClass("hide");
   }
}

//------------------------------------------------//

MapEditor.prototype.renderStyle = function(){
   StyleMenu.init($("#detailsMenu") , $("#quickEdit") , $("#zooms") , false , this.map , this.style.content);
}

MapEditor.prototype.cleanStyle = function(){

}

//------------------------------------------------//

MapEditor.prototype.renderColorbar = function(){
   ExtensionColorbar.init($("#colorbarMenu"), this.colorbar.content);
}

MapEditor.prototype.cleanColorbar = function(){

}

//==================================================================//

