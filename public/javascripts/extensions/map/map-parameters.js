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

MapParameters.DEFAULT                = "MapParameters.DEFAULT";

MapParameters.Vector                 = "vector";
MapParameters.Raster                 = "raster";

MapParameters.AlphaBlend             = "AlphaBlend";
MapParameters.AlphaClip              = "AlphaClip";
MapParameters.MulBlend               = "MulBlend";

//-----------------------------------------------------------------------------------//

function MapParameters (layers) {
   
   console.log("gathering parameters...");

   this.rasterUid    = null;
   this.contrast     = 0.0;
   this.luminosity   = 0.0;
   this.bwMethod     = 1.0;
   this.obs          = [];
   this.colorbars    = {};
   this.styles       = {};
   this.sources      = {};
   
   this.buildSources(layers);

// this.LayerOrder             = [  MapParameters.LayerBack    , MapParameters.LayerRaster         , MapParameters.LayerFront  ];
// this.LayerType              = [  MapParameters.Vector       , MapParameters.Raster              , MapParameters.Vector      ];

// this.LayerParams            = [  {"style"    : MapParameters.DEFAULT    , "source" : {"type"    : Source.MaperialOSM     , "params" : {} }, "layerAttribute" : "back" } , 
// {"colorbar" : MapParameters.DEFAULT    , "source" : {"type"    : Source.MaperialRaster  , "params" : {"uid" : "mescouilles"} } } ,
// {"style"    : MapParameters.DEFAULT    , "source" : {"type"    : Source.MaperialOSM     , "params" : {} }, "layerAttribute" : "front"}                                 ];

// this.ComposeShader          = [   null                     , MapParameters.MulBlend            , MapParameters.AlphaBlend   ];
// this.ComposeParams          = [   {}                       , {"uParams" : [ -0.5, -0.5, 1.0 ] } , {}                     ];
}

//---------------------------------------------------------------------------//

MapParameters.prototype.buildSources = function(layers){
   
   console.log("fecthing sources...");

   for(var i = 0; i < layers.length; i++){
      console.log(layers[i].type);
   }

   // todo : build this.sources from layers.sources
   
   this.sources = [ new Source(Source.MaperialOSM), new Source(Source.MaperialRaster) ];
}

//---------------------------------------------------------------------------//

MapParameters.prototype.AddOrRefreshStyle = function(name,style){
   if (style.constructor === String) {
      var me = this;
      me.styles[name] = null;
      $.ajax({
         url         : style ,
         async       : false,
         dataType    : 'json',
         success     : function (data) {
            me.styles[name] = data;
         }
      });
   }
   else {
      this.styles[name] = style;
   }

   $(window).trigger(MapEvents.STYLE_CHANGED);
}

MapParameters.prototype.GetStyle = function(name){
   if (name in this.styles)
      return this.styles[name];

   return this.styles[MapParameters.DEFAULT]
}

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

   $(window).trigger(MapEvents.COLORBAR_CHANGED);
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

   $(window).trigger(MapEvents.DATA_SOURCE_CHANGED);
}

MapParameters.prototype.SetContrast = function ( v ) {
   this.contrast      = v;

   $(window).trigger(MapEvents.CONTRAST_CHANGED);
}

MapParameters.prototype.GetContrast = function ( ) {
   return this.contrast;
}

MapParameters.prototype.SetLuminosity = function ( v ) {
   this.luminosity    = v;
   $(window).trigger(MapEvents.LUMINOSITY_CHANGED);
}

MapParameters.prototype.GetLuminosity = function ( ) {
   return this.luminosity;
}

MapParameters.prototype.SetBWMethod = function ( m ) {
   this.bwMethod      =  Math.max ( 0, Math.min ( 4 , Math.round ( m ) ) );
   $(window).trigger(MapEvents.BW_METHOD_CHANGED);
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
