//---------------------------------------------------------------------------//

MapParameters.shadersPath            = "assets/shaders";

MapParameters.mapCanvasName          = "map";
MapParameters.magnifierCanvasName    = "magnifier";

MapParameters.refreshRate            = 15; // ms
MapParameters.tileDLTimeOut          = 60000; //ms
MapParameters.tileSize               = 256;

MapParameters.autoMoveSpeedRate      = 0.2;
MapParameters.autoMoveMillis         = 700;
MapParameters.autoMoveDeceleration   = 0.005;
MapParameters.autoMoveAnalyseSize    = 10;

MapParameters.DEFAULT                = "MapParameters.DEFAULT_UID_TO_DEFINE";

MapParameters.Vector                 = "vector";
MapParameters.Raster                 = "raster";

MapParameters.AlphaBlend             = "AlphaBlend";
MapParameters.AlphaClip              = "AlphaClip";
MapParameters.MulBlend               = "MulBlend";

//-----------------------------------------------------------------------------------//

function MapParameters (maperial) {
   
   console.log("creating parameters...");

   this.maperial     = maperial;
   
   this.rasterUid    = null;
   this.contrast     = 0.0;
   this.luminosity   = 0.0;
   this.bwMethod     = 1.0;
   this.obs          = [];
   
   this.colorbars    = {};
   this.sources      = {};
   
   this.buildSources(this.maperial.config.layers);
}

//---------------------------------------------------------------------------//

MapParameters.prototype.buildSources = function(layers){
   
   console.log("fetching sources...");

//   for(var i = 0; i < layers.length; i++){
//      
//   }

   console.log("---> TODO");
   
   // todo : build this.sources from layers.sources
   //   this.sources = [ new Source(Source.MaperialOSM), new Source(Source.MaperialRaster) ];
   this.sources = [ new Source(Source.MaperialOSM) ];
}

//---------------------------------------------------------------------------//

MapParameters.prototype.GetStyle = function(uid){
   return this.maperial.stylesManager.styles[uid];
}

MapParameters.prototype.GetEditedStyle = function(){
   return this.maperial.stylesManager.styles[this.maperial.editedStyleUID];
}

//---------------------------------------------------------------------------//

MapParameters.prototype.AddOrRefreshColorbar = function(name,colorbar){

   if ( this.colorbars[name] )
      delete this.colorbars[name]

   this.colorbars[name] = new ColorBar();

   if (colorbar.constructor === String) {
      $.ajax({
         url         : colorbar ,
         async       : false,
         dataType    : 'json',
         success     : function (data) {
            this.colorbars[name].data = new Uint8Array(data);
         }
      });
   }
   else {
      this.colorbars[name].data = new Uint8Array(colorbar);
   }

   $(window).trigger(MaperialEvents.COLORBAR_CHANGED);
}

MapParameters.prototype.GetColorBars = function(){
   return this.colorbars;
}

MapParameters.prototype.GetColorBar = function(name){
   if (name in this.colorbars)
      return this.colorbars[name];
   return null;
}

MapParameters.prototype.SetRasterUid = function ( inUid ) {
   this.rasterUid  = inUid

   $(window).trigger(MaperialEvents.DATA_SOURCE_CHANGED);
}

MapParameters.prototype.SetContrast = function ( v ) {
   this.contrast      = v;

   $(window).trigger(MaperialEvents.CONTRAST_CHANGED);
}

MapParameters.prototype.GetContrast = function ( ) {
   return this.contrast;
}

MapParameters.prototype.SetLuminosity = function ( v ) {
   this.luminosity    = v;
   $(window).trigger(MaperialEvents.LUMINOSITY_CHANGED);
}

MapParameters.prototype.GetLuminosity = function ( ) {
   return this.luminosity;
}

MapParameters.prototype.SetBWMethod = function ( m ) {
   this.bwMethod      =  Math.max ( 0, Math.min ( 4 , Math.round ( m ) ) );
   $(window).trigger(MaperialEvents.BW_METHOD_CHANGED);
}

MapParameters.prototype.GetBWMethod = function ( ) {
   return this.bwMethod;
}

//---------------------------------------------------------------------------//
//quand est ce quon vire ca ??
//-----------------------------------------//

function ColorBar () {
   this.data = []
   this.tex  = null;
}

//-----------------------------------------//

MapParameters.prototype.SetDefaultColorBar = function (){

   console.log("SetDefaultColorBar");
   var cbData = [];   
   cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );
   for ( i = 1 ; i < 256 ; i = i + 1) {
      var r = Math.round(i*2);
      if (r <= 255){
         cbData.push ( 255 - r );cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 255 );
      }
      else {
         cbData.push ( 0 ) ;cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 255 );
      }
   }

   this.AddOrRefreshColorbar(MapParameters.DEFAULT, cbData);
}
