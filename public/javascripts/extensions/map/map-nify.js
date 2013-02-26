//==================================================================//

function Mapnify(){
   this.config;
   this.mapRenderer;
   this.mapMover;
}

//==================================================================//

//doit  etre mis dans this.config : 
//this.style = style;
//this.colorbar = colorbar;
//this.boundingBoxStartLat = boundingBoxStartLat;
//this.boundingBoxStartLon = boundingBoxStartLon;

Mapnify.prototype.apply = function(config){

   console.log("Mapnify apply config");
   console.log(config);

   this.changeConfig(config);
   this.load();

   //this.mover = new MapMover(this.map);
}

//==================================================================//

Mapnify.prototype.changeConfig = function(config){
   console.log("change config");

   //this.hud.hideAllTriggers();
   this.config = config;
   //this.hud.showTriggers();
   //this.hud.buildMapEditorSettings();
}

//==================================================================//

Mapnify.prototype.load = function() {

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
             MapParameters.scriptsPath + "/map/map-listener.js",
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
   
   this.enhanceConfig();
   this.buildMap();
   this.resizeComponents();

// this.renderMap();
// this.renderStyleMenu();
// this.renderTriggers();

// if(this.colorbar){
// this.renderColorbar();
// }

   //--------------------------//

   var tryGeoloc = false;
   GeoLoc.init("GeoLoc",$("#GeoLocGo"), this.map, tryGeoloc);

   //--------------------------//

   // screen is ready
   // dispatchEvent (work no more in progress) 
// $("#footer").css({ position : "fixed" });
// App.user.set("waiting", false);
}


//==================================================================//

Mapnify.prototype.enhanceConfig = function() {
   
   this.config.renderParameters = new MapParameters();
   this.config.renderParameters.SetStyle("default", this.config.styles[0].content);
   this.config.mapCanvas = $("#"+MapParameters.mapCanvasName);

   this.config.coordS = new CoordinateSystem ( MapParameters.tileSize );
   this.config.map.centerM = this.config.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.config.map.zoom = 14;

   if(this.config.hud[MapParameters.MAGNIFIER]){
      this.config.magnifierCanvas = $("#"+MapParameters.magnifierCanvasName);
   }
}

//==================================================================//

Mapnify.prototype.buildMap = function() {

   this.mapRenderer = new MapRenderer( this.config );
   this.mapMover = new MapMover( this.config );
   this.mapListener = new MapListener( this.config );


   // note : init si config seulement
// this.boundingBoxDrawer = new BoundingBoxDrawer(this.map);

// if(this.boundingBoxStartLat){
// this.boundingBoxDrawer.centerLat = this.boundingBoxStartLat;
// this.boundingBoxDrawer.centerLon = this.boundingBoxStartLon;
// this.map.SetCenter(this.boundingBoxDrawer.centerLat, this.boundingBoxDrawer.centerLon);
// }

}


//==================================================================//

Mapnify.prototype.resizeComponents = function() {
   this.mapRenderer.resize();
   this.mapMover.resizeDrawers();   
}



