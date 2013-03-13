//==================================================================//

function Maperial(){
   this.config;
   this.context;
   this.mapRenderer;
   this.mapMover;
   this.mapMouse;
   this.mapHUD;

   this.styleMenu;

   this.scriptsPath = "assets/javascripts/extensions";
}

//==================================================================//
//Global Events

function MaperialEvent(){}

MaperialEvent.LOADING          = "Maperial.LOADING";
MaperialEvent.FREE             = "Maperial.FREE";
MaperialEvent.REFRESH_SIZES    = "Maperial.REFRESH_SIZES";

//---------------------------------------------------------------------------//

function HUD(){}

HUD.DISABLED               = "Maperial.DISABLED";

HUD.TRIGGER                = "trigger";
HUD.PANEL                  = "panel";

HUD.SETTINGS               = "HUDSettings";
HUD.MAGNIFIER              = "Magnifier";
HUD.COLORBAR               = "ColorBar";
HUD.LATLON                 = "LatLon";
HUD.SCALE                  = "Scale";
HUD.MAPKEY                 = "MapKey";
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

Maperial.prototype.apply = function(config){
   this.config = config;
   this.reset();
   this.load();
}

//==================================================================//

Maperial.prototype.reset = function(){
   
   try{
      this.mapRenderer.removeListeners();
      this.mapMover.removeListeners();
      this.mapMouse.removeListeners();
      this.mapHUD.removeListeners();
      this.styleMenu.removeListeners();
   }catch(e){}
   
   var me = this;
   me = new Maperial();
}

//==================================================================//

Maperial.prototype.load = function() {

   $(window).trigger(MaperialEvent.LOADING);

   var maperial = this; // to have access to 'this' in the callBack
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
             maperial.build();
          });                    

}

//==================================================================//

Maperial.prototype.build = function() {

   console.log("Maperial.build");

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

   this.refreshScreen();
   
   //--------------------------//

   var tryGeoloc = false;
   GeoLoc.init("GeoLoc", $("#GeoLocGo"), this, tryGeoloc);

   //--------------------------//

   $(window).trigger(MaperialEvent.FREE);
   $(window).resize(Utils.apply ( this , "refreshScreen" ) );
   
   this.isBuilt = true;
}


//==================================================================//

Maperial.prototype.createContext = function() {

   this.context = {};
   this.context.mapCanvas  = $("#"+MapParameters.mapCanvasName);
   this.context.coordS     = new CoordinateSystem ( MapParameters.tileSize );
   this.context.centerM    = this.context.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.context.mouseM     = this.context.centerM;     // Mouse coordinates in meters
   this.context.mouseP     = null;                     // Mouse coordinates inside the canvas
   this.context.zoom       = 14;

   if(this.config.hud[HUD.MAGNIFIER]){
      console.log("Magnifier On");
      this.context.magnifierCanvas = $("#"+MapParameters.magnifierCanvasName);
   }

}

//==================================================================//

Maperial.prototype.enhanceConfig = function() {

   this.config.renderParameters = new MapParameters();
   this.config.renderParameters.AddOrRefreshStyle("default", this.config.styles[0]);

}

//==================================================================//

Maperial.prototype.buildMap = function() {

   this.mapRenderer = new MapRenderer( this );
   this.mapMover = new MapMover( this );
   this.mapMouse = new MapMouse( this );
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

Maperial.prototype.refreshScreen = function() {
   
   var w = $(window).width(); 
   var h = $(window).height();
   
   if(this.config.map.width)
      w = this.config.map.width;

   if(this.config.map.height)
      h = this.config.map.height;
      
   
   if(this.context.mapCanvas[0]){
      this.context.mapCanvas.css("width", w);
      this.context.mapCanvas.css("height", h);
      this.context.mapCanvas[0].width = w;
      this.context.mapCanvas[0].height = h;
   }

   this.mapRenderer.fitToSize();
   this.mapMover.resizeDrawers();
   this.mapHUD.placeHUD();
}

//==================================================================//

Maperial.prototype.buildStyleMenu = function() {
   this.styleMenu = new StyleMenu($("#detailsMenu") , $("#quickEdit") , $("#zooms") , this);
}

//==================================================================//

Maperial.prototype.buildHUD = function() {
   this.mapHUD = new MapHUD( this );
}

//==================================================================//

Maperial.prototype.SetCenter=function(lat,lon){
   this.context.centerM = this.context.coordS.LatLonToMeters( lat , lon );
   this.mapRenderer.DrawScene();
}

Maperial.prototype.SetZoom = function(z){
   if ( z > -1 && z < 19 ){
      this.context.zoom = z;
   }
}

Maperial.prototype.GetZoom = function(){
   return this.context.zoom;
}

Maperial.prototype.ZoomIn = function(){
   if ( this.context.zoom < 18 ){
      this.SetZoom(this.context.zoom + 1 );
   }
}

Maperial.prototype.ZoomOut = function(){
   if ( this.context.zoom > 0 ){
      this.SetZoom(this.context.zoom - 1 );
   }
}

