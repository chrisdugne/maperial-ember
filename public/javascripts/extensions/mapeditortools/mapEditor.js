
//==================================================================//

function MapEditor(style, colorbar){
   this.map;
   this.style = style;
   this.colorbar = colorbar;
   this.boundingBoxManager;
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
                  //-----------------------------
                  // rendering after reception
         
                  mapEditor.renderMap();
                  mapEditor.renderStyle();
                  mapEditor.renderTriggers();
                  
                  if(mapEditor.colorbar){
                     mapEditor.renderColorbar();
                     mapEditor.renderMap();
                  }

                  mapEditor.boundingBoxManager = new BoundingBoxManager(mapEditor.map);
         
                  // screen is ready
                  App.user.set("waiting", false);
               });
          }
   );
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
   console.log (cbData ) 

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

   $("#styleEditorTriggers").addClass("hide");
   $("#styleEditorManagement").addClass("hide");
   
}

MapEditor.prototype.renderTriggers = function(){
   
   $(".trigger").click(function(){
      var name = $(this).context.id.replace("trigger","");
      $("#panel"+name).toggle("fast");
      $(this).toggleClass("active");
      return false;
   });

   $("#styleEditorTriggers").removeClass("hide");
   $("#styleEditorManagement").removeClass("hide");

}

//------------------------------------------------//

MapEditor.prototype.renderStyle = function(){
   // set the menu up
   StyleMenu.init($("#mapnifyMenu") , $("#mapnifyWidget") , $("#mapnifyZoom") , false , this.map , this.style.content);
}

MapEditor.prototype.cleanStyle = function(){
   $("#style").remove();
}

//------------------------------------------------//

MapEditor.prototype.renderColorbar = function()
{
   ExtensionColorbar.init($("#mapnifyColorBar"), this.colorbar.content, this.style.content);

   $("#colorbar").dialogr({
      width:460,
      minWidth:460,
      height:590,
      position : [15,170],
      closeOnEscape: false,
      dialogClass: 'no-close'
   });

   $(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);
}

MapEditor.prototype.cleanColorbar = function()
{
   $("#colorbar").remove();
}

//==================================================================//

