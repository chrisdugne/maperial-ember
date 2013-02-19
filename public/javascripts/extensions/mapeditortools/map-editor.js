
//==================================================================//

function MapEditor(style, colorbar, showStyleTriggers, showColorbarTriggers){
   this.map;
   this.startLat;
   this.startLon;
   this.style = style;
   this.colorbar = colorbar;
   this.boundingBoxDrawer;
   this.showStyleTriggers = showStyleTriggers;
   this.showColorbarTriggers = showColorbarTriggers;
}

//==================================================================//

MapEditor.prototype.renderUI = function(lat, lon) {

   App.user.set("waiting", true);
   
   this.startLon = lon;
   this.startLat = lat;
   
   var tryGeoloc = this.startLat == undefined;
   
   var mapEditor = this; // to have access to 'this' in the callBack

   ScriptLoader.getScripts([
             // map rendering
             "assets/javascripts/libs/gl-matrix-min.js",
             "assets/javascripts/extensions/maprendering/coordinate-system.js",
             "assets/javascripts/extensions/maprendering/gl-map-parameters.js",
             "assets/javascripts/extensions/maprendering/gl-tools.js",
             "assets/javascripts/extensions/maprendering/gl-rasterlayer.js",
             "assets/javascripts/extensions/maprendering/gl-tile.js",
             "assets/javascripts/extensions/maprendering/gl-vectoriallayer.js",
             "assets/javascripts/extensions/maprendering/render-line.js",
             "assets/javascripts/extensions/maprendering/render-text.js",
             "assets/javascripts/extensions/maprendering/tile-renderer.js",
             "assets/javascripts/extensions/maprendering/map-mover.js",
             "assets/javascripts/extensions/maprendering/geoloc.js",
             "assets/javascripts/extensions/maprendering/gl-map.js",

             // map editing
             "assets/javascripts/extensions/mapeditortools/fabric.all.1.0.6.js",
             "assets/javascripts/extensions/mapeditortools/boundingbox-drawer.js",
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
                     mapEditor.renderAll(tryGeoloc);
                  });
      
               }
               else{
                  // rendering after reception
                  mapEditor.renderAll(tryGeoloc);
               }
            });
       }
   );
}


MapEditor.prototype.renderAll = function(tryGeoloc){

   this.renderMap();
   this.renderStyle();
   this.renderTriggers();

   if(this.colorbar){
      this.renderColorbar();
   }

   this.boundingBoxDrawer = new BoundingBoxDrawer(this.map);
   GeoLoc.init("GeoLoc",$("#GeoLocGo"), this.map, tryGeoloc);

   // screen is ready
   App.user.set("waiting", false);
}


MapEditor.prototype.cleanUI = function(){
   this.cleanStyle();
   this.cleanColorbar();
   this.cleanMap();
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
   
   this.center();
   
   // weird..but $("#webappDiv").height()  is false here...
   App.resizeWindow();
   
   $("#map").css("width", $("#webappDiv").width() );
   $("#map").css("height", $("#webappDiv").height() - App.Globals.HEADER_HEIGHT ); // on a le header dans la webappdiv !!
   

   console.log("webAppHeight : " + $("#webappDiv").height());
   console.log("maph : " + ($("#webappDiv").height() - App.Globals.HEADER_HEIGHT));
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

   //--------------------------------------------------------//

   var mapEditor = this;

   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var name = $(this).context.id.replace("panel","");
      mapEditor.putOnTop(name);
   });

   $(".trigger").click(function(){

      var name = $(this).context.id.replace("trigger","");
      mapEditor.putOnTop(name);

      if ($(this).hasClass('noclick')) {
         $(this).removeClass('noclick');
      }
      else {

         if ($(this).hasClass('active')) {
            $(this).draggable("enable");
         }
         else{
            $(this).draggable("disable");
         }

         $("#panel"+name).toggle("fast");
         $(this).toggleClass("active");
      }

      return false;
   });

   //--------------------------------------------------------//
   // Dragging

   $( ".panel" ).draggable({ snap: "#map" , containment: "#map", scroll: false });
   $( ".trigger" ).draggable({ snap: "#map", containment: "#map", scroll: false });

   $( ".panel" ).bind('dragstart',function( event ){
      var id = $(this).context.id;
      var name = id.replace("panel","");

      $("#trigger"+name).css({
         opacity : 0
      });

      mapEditor.putOnTop(name);
   });


   $( ".panel" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("panel","");
      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");

      $("#trigger"+name).css({
         top: newTop,
         left: newLeft,
         opacity : 1
      });
      
   });

   $( ".trigger" ).bind('dragstart',function( event ){
      $(this).addClass('noclick');

      var name = $(this).context.id.replace("trigger","");
      mapEditor.putOnTop(name);
   });

   $( ".trigger" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("trigger","");

      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");
      $("#panel"+name).css({
         top: newTop,
         left: newLeft
      });
      
   });

   //--------------------------------------------------------//
   // Show

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

MapEditor.prototype.putOnTop = function(name){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+name).css({ zIndex : 201 });
   $("#panel"+name).css({ zIndex : 200 });  
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

//------------------------------------------------//

MapEditor.prototype.showBoundingBox = function(){

   if(App.datasetsData.selectedRaster){
      
      var topLeftMeters = this.map.coordS.LatLonToMeters(App.datasetsData.selectedRaster.latMin, App.datasetsData.selectedRaster.lonMin); 
      var bottomRightMeters = this.map.coordS.LatLonToMeters(App.datasetsData.selectedRaster.latMax, App.datasetsData.selectedRaster.lonMax);
      var centerP = this.map.coordS.MetersToPixels(this.map.centerM.x, this.map.centerM.y, this.map.zoom);
      
      console.log("-----------------------");
      console.log("centerP : " + centerP.x + " | " + centerP.y);

      var topLeftP = this.map.coordS.MetersToPixels(topLeftMeters.x, topLeftMeters.y, this.map.zoom);
      var bottomRightP = this.map.coordS.MetersToPixels(bottomRightMeters.x, bottomRightMeters.y, this.map.zoom);

      console.log("-----------------------");
      console.log("topLeftP : " + topLeftP.x + " | " + topLeftP.y);
      console.log("bottomRightP : " + bottomRightP.x + " | " + bottomRightP.y);

      var topLeftPoint = new Point(topLeftP.x - centerP.x, topLeftP.y - centerP.y) ;
      var bottomRightPoint = new Point(bottomRightP.x - centerP.x, bottomRightP.y - centerP.y) ;

      console.log("==============");
      console.log("topLeftPoint : " + topLeftPoint.x + " | " + topLeftPoint.y);
      console.log("bottomRightPoint : " + bottomRightPoint.x + " | " + bottomRightPoint.y);

      this.boundingBoxDrawer.init("drawBoard", $("#webappDiv").width(), $("#webappDiv").height(), topLeftPoint, bottomRightPoint);
   }
   else{
      this.boundingBoxDrawer.init("drawBoard", $("#webappDiv").width(), $("#webappDiv").height());
   }

   $("#drawBoardContainer").removeClass("hide");
}

MapEditor.prototype.hideBoundingBox = function(){

   $("#drawBoardContainer").addClass("hide");

}

MapEditor.prototype.deactivateBoundingBoxDrawing = function(){
   this.boundingBoxDrawer.deactivateDrawing();
}

MapEditor.prototype.activateBoundingBoxDrawing = function(){
   this.boundingBoxDrawer.activateDrawing();
}

//==================================================================//


MapEditor.prototype.center = function(){
   this.map.SetCenter(this.startLat, this.startLon);
}
