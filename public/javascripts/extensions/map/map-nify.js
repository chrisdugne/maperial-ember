//==================================================================//

function Mapnify(){
   this.config;
   this.context;
   this.mapRenderer;
   this.mapMover;
   this.mapMouse;
   this.mapHUD;
   
   this.isBuilt;
}

Mapnify.Loading = "Mapnify.Loading";
Mapnify.Free = "Mapnify.Free";
Mapnify.RefreshSizes = "Mapnify.RefreshSizes";

//==================================================================//

//doit  etre mis dans this.config : 
//this.style = style;
//this.colorbar = colorbar;
//this.boundingBoxStartLat = boundingBoxStartLat;
//this.boundingBoxStartLon = boundingBoxStartLon;

Mapnify.prototype.apply = function(config){

   console.log("Mapnify apply config");
   console.log(config);

   if(this.isBuilt){
      this.changeConfig(config);
   }
   else{
      this.config = config;
      this.load();
   }
}

//==================================================================//

Mapnify.prototype.changeConfig = function(config){
   console.log("change config");

   this.mapHUD.reset();
   this.config = config;
   this.mapHUD.display();
}

//==================================================================//

Mapnify.prototype.load = function() {

   $(window).trigger(Mapnify.Loading);
   console.log("Mapnify.build");
   
   var mapnify = this; // to have access to 'this' in the callBack
   ScriptLoader.getScripts([
             // libs
             MapParameters.scriptsPath + "/map/libs/gl-matrix-min.js",
             MapParameters.scriptsPath + "/map/libs/coordinate-system.js",
             MapParameters.scriptsPath + "/map/libs/geoloc.js",
             MapParameters.scriptsPath + "/map/libs/fabric.all.1.0.6.js",
             MapParameters.scriptsPath + "/map/libs/colorpicker.js",
             MapParameters.scriptsPath + "/map/libs/RGBColor.js",
             MapParameters.scriptsPath + "/map/libs/hashmap.js",
             MapParameters.scriptsPath + "/map/libs/canvasutilities.js",

             // rendering
             MapParameters.scriptsPath + "/map/rendering/gl-tools.js",
             MapParameters.scriptsPath + "/map/rendering/gl-rasterlayer.js",
             MapParameters.scriptsPath + "/map/rendering/gl-tile.js",
             MapParameters.scriptsPath + "/map/rendering/gl-vectoriallayer.js",
             MapParameters.scriptsPath + "/map/rendering/render-line.js",
             MapParameters.scriptsPath + "/map/rendering/render-text.js",
             MapParameters.scriptsPath + "/map/rendering/tile-renderer.js",

             // modules
             MapParameters.scriptsPath + "/map/map-events.js",
             MapParameters.scriptsPath + "/map/map-mover.js",
             MapParameters.scriptsPath + "/map/map-mouse.js",
             MapParameters.scriptsPath + "/map/map-hud.js",
             MapParameters.scriptsPath + "/map/map-renderer.js",

             // edition
             MapParameters.scriptsPath + "/map/edition/boundingbox-drawer.js",
             MapParameters.scriptsPath + "/map/edition/colortool.js",
             MapParameters.scriptsPath + "/map/edition/symbolizer.js",
             MapParameters.scriptsPath + "/map/edition/style-menu.js",
             MapParameters.scriptsPath + "/map/edition/colorbar-renderer.js"

             ],
      function(){
         mapnify.build();
      });                    

}

//==================================================================//

Mapnify.prototype.build = function() {

   console.log("Mapnify.build");

   //--------------------------//
   
   this.createContext();
   this.enhanceConfig();

   this.buildMap();
   this.buildHUD();

   this.buildStyleMenu();

// if(this.colorbar){
// this.renderColorbar();
// }

   //--------------------------//

   var tryGeoloc = false;
   GeoLoc.init("GeoLoc",$("#GeoLocGo"), this.map, tryGeoloc);

   //--------------------------//

   $(window).trigger(Mapnify.Free);
   this.isBuilt = true;
}


//==================================================================//

Mapnify.prototype.createContext = function() {

   this.context = {};
   this.context.mapCanvas  = $("#"+MapParameters.mapCanvasName);
   this.context.coordS     = new CoordinateSystem ( MapParameters.tileSize );
   this.context.centerM    = this.context.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.context.mouseM     = this.context.centerM;     // Mouse coordinates in meters
   this.context.mouseP     = null;                     // Mouse coordinates inside the canvas
   this.context.zoom       = 14;
   this.context.autoMoving = false;

}

//==================================================================//

Mapnify.prototype.enhanceConfig = function() {
   
   this.config.renderParameters = new MapParameters();
   this.config.renderParameters.SetStyle("default", this.config.styles[0].content);

   if(this.config.hud[MapParameters.MAGNIFIER]){
      this.config.magnifierCanvas = $("#"+MapParameters.magnifierCanvasName);
   }
   
}

//==================================================================//

Mapnify.prototype.buildMap = function() {

   this.mapRenderer = new MapRenderer( this );
   this.mapMover = new MapMover( this );
   this.mapMouse = new MapMouse( this );

   this.refreshScreen();
   this.mapRenderer.Start();
   
   // note : init si config seulement
// this.boundingBoxDrawer = new BoundingBoxDrawer(this.map);

// if(this.boundingBoxStartLat){
// this.boundingBoxDrawer.centerLat = this.boundingBoxStartLat;
// this.boundingBoxDrawer.centerLon = this.boundingBoxStartLon;
// this.map.SetCenter(this.boundingBoxDrawer.centerLat, this.boundingBoxDrawer.centerLon);
// }

}

//-----------------------------------------------//

Mapnify.prototype.refreshScreen = function() {
 this.mapRenderer.fitToSize();
 this.mapMover.resizeDrawers();   
}

//==================================================================//

Mapnify.prototype.buildStyleMenu = function() {
   StyleMenu.init($("#detailsMenu") , $("#quickEdit") , $("#zooms") , this);
}

//==================================================================//

Mapnify.prototype.buildHUD = function() {
   this.mapHUD = new MapHUD( this );
}

//==================================================================//

Mapnify.prototype.SetCenter=function(lat,lon){
   this.context.centerM = this.context.coordS.LatLonToMeters( lat , lon );
   this.mapRenderer.DrawScene();
}

Mapnify.prototype.SetZoom = function(z){
   if ( z > -1 && z < 19 ){
      this.context.zoom = z;
   }
}

Mapnify.prototype.GetZoom = function(){
   return this.context.zoom;
}

Mapnify.prototype.ZoomIn = function(){
   if ( this.context.zoom < 18 ){
      this.SetZoom(this.context.zoom + 1 );
   }
}

Mapnify.prototype.ZoomOut = function(){
   if ( this.context.zoom > 0 ){
      this.SetZoom(this.context.zoom - 1 );
   }
}

