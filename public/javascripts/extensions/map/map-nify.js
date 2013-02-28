//==================================================================//

function Mapnify(){
   this.config;
   this.context;
   this.mapRenderer;
   this.mapMover;
   this.mapMouse;
   this.mapHUD;
   
   this.isBuilt;

   this.scriptsPath = "assets/javascripts/extensions";
}

//==================================================================//
// Global Events

function MapnifyEvent(){}

MapnifyEvent.LOADING          = "Mapnify.LOADING";
MapnifyEvent.FREE             = "Mapnify.FREE";
MapnifyEvent.REFRESH_SIZES    = "Mapnify.REFRESH_SIZES";

//---------------------------------------------------------------------------//

function HUD(){}

HUD.DISABLED               = "Mapnify.DISABLED";
HUD.REQUIRED               = "Mapnify.REQUIRED";
HUD.OPTION                 = "Mapnify.OPTION";

HUD.TRIGGER                = "trigger";
HUD.PANEL                  = "panel";

HUD.MAGNIFIER              = "Magnifier";
HUD.COLOR_BAR              = "ColorBar";
HUD.LATLON                 = "LatLon";
HUD.GEOLOC                 = "Geoloc";
HUD.DETAILS_MENU           = "DetailsMenu";
HUD.QUICK_EDIT             = "QuickEdit";
HUD.ZOOMS                  = "Zooms";

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

   $(window).trigger(MapnifyEvent.LOADING);
   console.log("Mapnify.build");
   
   var mapnify = this; // to have access to 'this' in the callBack
   ScriptLoader.getScripts([
             // libs
             this.scriptsPath + "/map/libs/gl-matrix-min.js",
             this.scriptsPath + "/map/libs/coordinate-system.js",
             this.scriptsPath + "/map/libs/geoloc.js",
             this.scriptsPath + "/map/libs/fabric.all.1.0.6.js",
             this.scriptsPath + "/map/libs/colorpicker.js",
             this.scriptsPath + "/map/libs/RGBColor.js",
             this.scriptsPath + "/map/libs/hashmap.js",
             this.scriptsPath + "/map/libs/canvasutilities.js",

             // rendering
             this.scriptsPath + "/map/rendering/gl-tools.js",
             this.scriptsPath + "/map/rendering/gl-rasterlayer.js",
             this.scriptsPath + "/map/rendering/gl-tile.js",
             this.scriptsPath + "/map/rendering/gl-vectoriallayer.js",
             this.scriptsPath + "/map/rendering/render-line.js",
             this.scriptsPath + "/map/rendering/render-text.js",
             this.scriptsPath + "/map/rendering/tile-renderer.js",

             // modules
             this.scriptsPath + "/map/map-events.js",
             this.scriptsPath + "/map/map-parameters.js",
             this.scriptsPath + "/map/map-mouse.js",
             this.scriptsPath + "/map/map-hud.js",
             this.scriptsPath + "/map/map-renderer.js",
             this.scriptsPath + "/map/map-mover.js",

             // edition
             this.scriptsPath + "/map/edition/boundingbox-drawer.js",
             this.scriptsPath + "/map/edition/colortool.js",
             this.scriptsPath + "/map/edition/symbolizer.js",
             this.scriptsPath + "/map/edition/style-menu.js",
             this.scriptsPath + "/map/edition/colorbar-renderer.js"

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

   $(window).trigger(MapnifyEvent.FREE);
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

   if(this.config.hud[HUD.MAGNIFIER]){
      console.log("Magnifier On");
      this.context.magnifierCanvas = $("#"+MapParameters.magnifierCanvasName);
   }

}

//==================================================================//

Mapnify.prototype.enhanceConfig = function() {
   
   this.config.renderParameters = new MapParameters();
   this.config.renderParameters.AddOrRefreshStyle("default", this.config.styles[0].content);
   
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

