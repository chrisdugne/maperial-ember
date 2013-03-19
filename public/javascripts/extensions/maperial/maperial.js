//==================================================================//

function Maperial(){
   
   this.config;
   this.context;
   
   this.mapRenderer;
   this.mapMover;
   this.mapMouse;
   this.hud;

   this.stylesManager = new StylesManager(this);

   this.styleMenu;

   this.serverURL   = "//map.x-ray.fr";
   this.scriptsPath = "assets/javascripts/extensions";
}

//==================================================================//
//doit  etre mis dans this.config : 

//this.colorbar = colorbar;
//this.boundingBoxStartLat = boundingBoxStartLat;
//this.boundingBoxStartLon = boundingBoxStartLon;

//==================================================================//

Maperial.prototype.apply = function(config){
   this.config = config;
   this.reset();
   this.load();
}

//==================================================================//

Maperial.prototype.stop = function(){
   this.reset();
}

//==================================================================//

Maperial.prototype.reset = function(){

   try{
      this.mapRenderer.removeListeners();
      this.mapMover.removeListeners();
      this.mapMouse.removeListeners();
      this.hud.removeListeners();
      this.styleMenu.removeListeners();
   }catch(e){}

   var stylesCache = this.stylesManager.styles;
   var me = this;
   me = new Maperial();
   me.stylesManager.styles = stylesCache;
}

//==================================================================//

Maperial.prototype.load = function() {

   console.log("Starting maperialJS build...");

   //--------------------------//

   $(window).trigger(MaperialEvents.LOADING);

   //--------------------------//

   this.checkConfig();

   //--------------------------//

   var maperial = this;
   this.loadStyles(function(){
      maperial.build();
   });
}

Maperial.prototype.build = function() {

   console.log("starting build...");

   //--------------------------//

   this.createContext();

   //--------------------------//

   this.buildMap();
   this.buildHUD();

   if(this.config.edition)
      this.buildStyleMenu();
   
//   if(this.editedColorbarUID)
//      this.buildColorbar();

   //--------------------------//
   
   this.initGeoloc();

   //--------------------------//

   this.refreshScreen();
   $(window).resize(Utils.apply ( this , "refreshScreen" ) );

   //--------------------------//

   $(window).trigger(MaperialEvents.READY);

   //--------------------------//

   this.isBuilt = true;
}

//==================================================================//

Maperial.prototype.checkConfig = function() {

   console.log("checking config...");
     
   //--------------------------//
   // checking serverURL
   
   if(!this.config.serverURL)
      this.config.serverURL = this.serverURL;

   //--------------------------//
   // checking layer config
      
   if(!this.config.layers)
      this.useDefaultLayers(); 
   else
      console.log("  using custom layers...");

   //--------------------------//
   // checking if Default style must be used
   
   for(var i = 0; i < this.config.layers.length; i++){
      
      if(this.config.layers[i].source.type != Source.MaperialOSM)
         continue;

      var layerParams = this.config.layers[i].params;
      if(!layerParams.styles){
         console.log("  using default style...");
         layerParams.styles = {};
         layerParams.styles[0] = MapParameters.DEFAULT;
         layerParams.selectedStyle = 0;
      }
   }
}

//------------------------------------------------------------------//

Maperial.prototype.useDefaultLayers = function() {

   console.log("using default layers...");

   this.config.layers = [
       { 
          type: MapParameters.Vector, 
          source: {
             type: Source.MaperialOSM
          },
          params: {
             group : VectorialLayer.BACK 
          }
       }
    ];

}

//Maperial.prototype.useDefaultLayers = function() {

//console.log("using default layers...");

//this.config.layers = [
//{ 
//type: MapParameters.Vector, 
//source: {
//type: Source.MaperialOSM
//},
//params: {
//group : VectorialLayer.BACK, 
//styles: [MapParameters.DEFAULT],
//selectedStyle: 0
//}
//},
//{ 
//type: MapParameters.Raster, 
//source: {
//type: Source.MaperialRaster,
//params: { uid : "rasterUID" }
//},
//params: {
//colorbar: MapParameters.DEFAULT, 
//},
//composition: {
//shader : MapParameters.MulBlend,
//params : { uParams : [ -0.5, -0.5, 1.0 ]}
//}
//},
//{ 
//type: MapParameters.Vector, 
//source: {
//type: Source.MaperialOSM
//},
//params: {
//group : VectorialLayer.FRONT, 
//styles: [MapParameters.DEFAULT],
//selectedStyle: 0
//},
//composition: {
//shader : MapParameters.AlphaBlend
//}
//}
//];

//}

//==================================================================//

Maperial.prototype.loadStyles = function(next){

   console.log("loading styles...");
   var styleUIDs = [];

   for(var i = 0; i < this.config.layers.length; i++){
      var layerParams = this.config.layers[i].params;
      if(layerParams.styles){
         styleUIDs[i] = layerParams.styles[layerParams.selectedStyle];
      }
   }

   this.stylesManager.getStyles(styleUIDs, next);
}

//==================================================================//

Maperial.prototype.createContext = function() {

   console.log("creating context...");

   this.context = {};
   this.context.mapCanvas  = $("#"+MapParameters.mapCanvasName);
   this.context.coordS     = new CoordinateSystem ( MapParameters.tileSize );
   this.context.centerM    = this.context.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.context.mouseM     = this.context.centerM;     // Mouse coordinates in meters
   this.context.mouseP     = null;                     // Mouse coordinates inside the canvas
   this.context.zoom       = 14;

   this.context.parameters = new MapParameters(this);

   if(this.config.hud[HUD.MAGNIFIER]){
      this.context.magnifierCanvas = $("#"+MapParameters.magnifierCanvasName);
   }

}

//==================================================================//

Maperial.prototype.buildMap = function() {

   console.log("building map...");

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

//==================================================================//

Maperial.prototype.initGeoloc = function() {
   if(this.config.hud[HUD.GEOLOC]){
      GeoLoc.init("GeoLoc", $("#GeoLocGo"), this, false);
   }   
}

//==================================================================//
   
Maperial.prototype.buildStyleMenu = function() {

   var styleUID;
   
   for(var i = 0; i < this.config.layers.length; i++){
      var layerParams = this.config.layers[i].params;
      if(layerParams.styles){
         styleUID = layerParams.styles[layerParams.selectedStyle];
         break;
      }
   }
   
   this.styleMenu = new StyleMenu($("#detailsMenu") , $("#quickEdit") , $("#zooms") , this, styleUID);
}

//==================================================================//

Maperial.prototype.buildHUD = function() {
   this.hud = new HUD( this );
}

//==================================================================//

Maperial.prototype.refreshScreen = function() {

   console.log("refreshing screen...");

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
   this.hud.placeElements();
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

