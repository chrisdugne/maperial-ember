//==================================================================//

function Maperial(){

   this.config;
   this.context;

   this.mapRenderer;
   this.mapMover;
   this.mapMouse;
   this.hud;

   this.stylesManager = new StylesManager(this);
   this.layersManager = new LayersManager(this);

   this.styleMenu;
}

//==================================================================//
//doit  etre mis dans this.config : 

//this.colorbar = colorbar;
//this.boundingBoxStartLat = boundingBoxStartLat;
//this.boundingBoxStartLon = boundingBoxStartLon;

//==================================================================//

/**
 * Must be called whenever the config is changed, in order to build Maperial again
 */
Maperial.prototype.restart = function(){
   this.reset();
   this.load();
}

//==================================================================//

Maperial.prototype.apply = function(config){
   console.log("maperial.apply");
   console.log(config);
   this.config = config;
   this.restart();
}

//==================================================================//

Maperial.prototype.reset = function(){

   console.log("Reset maperial...");
   
   try{
      this.mapRenderer.reset();
   }catch(e){}
   
   try{
      this.mapMover.removeListeners();
      this.mapMouse.removeListeners();
      this.hud.removeListeners();
   }catch(e){}

   try{
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
   // After having checked the config, there still may be no layers.
   // For instance in webapp.layersCreation the user may remove every layers.
   
   if(this.config.layers.length > 0){
      var maperial = this;
      this.loadStyles(function(){
         maperial.checkGroups();
         maperial.build();
      });
   }
   else{
      this.finishStartup();
   }
}

//==================================================================//

Maperial.prototype.build = function() {

   console.log("starting build...");

   //--------------------------//

   this.createContext();

   //--------------------------//

   this.buildMap();
   this.buildHUD();

   if(this.config.edition)
      this.buildStyleMenu();

// if(this.editedColorbarUID)
// this.buildColorbar();

   //--------------------------//

   this.initGeoloc();
   
   //--------------------------//
   
   this.finishStartup();
}

//==================================================================//

Maperial.prototype.finishStartup = function() {

   this.refreshScreen();
   $(window).resize(Utils.apply ( this , "refreshScreen" ) );

   $(window).trigger(MaperialEvents.READY);
}

//==================================================================//

Maperial.prototype.checkConfig = function() {

   console.log("checking config...");

   //--------------------------//
   // checking default objects

   if(!this.config)
      this.config = {};

   if(!this.config.hud)
      this.config.hud = {elements:{}, options:{}};

   if(!this.config.map)
      this.config.map = {};

   //--------------------------//
   // checking serverURL
//
//   if(!this.config.serverURL)
//      this.config.serverURL = MapParameters.serverURL;

   //--------------------------//
   // checking layer config

   if(!this.config.layers)
      this.layersManager.useDefaultLayers();
   else{
      console.log("  using custom layers...");
      console.log(this.config.layers);
   }

   //--------------------------//
   // checking if Default style must be used

   this.changeStyle(MapParameters.DEFAULT_STYLE_UID, 0, false);
   
}

//==================================================================//

Maperial.prototype.loadStyles = function(next){

   console.log("checking styles...");
   var styleUIDs = [];

   for(var i = 0; i < this.config.layers.length; i++){
      var layerParams = this.config.layers[i].params;
      if(layerParams.styles){
         styleUIDs[i] = layerParams.styles[layerParams.selectedStyle];
      }
   }

   if(styleUIDs.length > 0){
      console.log("loading styles...");
      this.stylesManager.fetchStyles(styleUIDs, next);
   }
   else 
      next();
}

//==================================================================//

Maperial.prototype.changeStyle = function(styleUID, position, overidde){
   
   if(position === undefined) position = 0;
   if(overidde === undefined) overidde = true;

   for(var i = 0; i < this.config.layers.length; i++){

      if(this.config.layers[i].source.type != Source.MaperialOSM)
         continue;

      var layerParams = this.config.layers[i].params;
      if(!layerParams.styles || overidde){
         
         if(!overidde)
            console.log("  using default style...");
         else
            console.log("Changing style...");
         
         layerParams.styles = {};
         layerParams.styles[position] = styleUID;
         layerParams.selectedStyle = position;
      }
   }
   
   if(overidde)
      this.restart();
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

   if(this.config.hud.elements[HUD.MAGNIFIER]){
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
   if(this.config.hud.elements[HUD.GEOLOC]){
      GeoLoc.init("GeoLoc", $("#GeoLocGo"), this, false);
   }   
}

//==================================================================//

Maperial.prototype.buildStyleMenu = function() {
   this.styleMenu = new StyleMenu($("#detailsMenu") , $("#quickEdit") , $("#zooms") , this);
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

Maperial.prototype.checkGroups = function(){

   console.log("checking groups...");

   var selectedStyle = this.stylesManager.getSelectedStyle();
   
   if(selectedStyle && !this.config.groups){
      this.layersManager.buildGroups(selectedStyle);
   }
   
}

//==================================================================//

Maperial.prototype.SetCenter = function(lat,lon){
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

//---------------------------------------------------------------------------//

