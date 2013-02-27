
//---------------------------------------------------------------------------//

function ColorBar () {
   this.data = []
   this.tex  = null;
}

//---------------------------------------------------------------------------//
// HUD names

MapParameters.MAGNIFIER              = "Magnifier";
MapParameters.COLOR_BAR              = "ColorBar";
MapParameters.LATLON                 = "LatLon";
MapParameters.GEOLOC                 = "Geoloc";
MapParameters.DETAILS_MENU           = "DetailsMenu";
MapParameters.QUICK_EDIT             = "QuickEdit";
MapParameters.ZOOMS                  = "Zooms";

//---------------------------------------------------------------------------//

MapParameters.scriptsPath            = "assets/javascripts/extensions";
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

MapParameters.StyleChanged           = 1;
MapParameters.ColorBarChanged        = 2;
MapParameters.ContrastChanged        = 3;
MapParameters.LuminosityChanged      = 4;
MapParameters.BWMethodChanged        = 5;
MapParameters.dataSrcChanged         = 6;

MapParameters.LayerBack              = "back";
MapParameters.LayerRaster            = "raster";
MapParameters.LayerFront             = "front";
MapParameters.LayerSelect            = "select";

MapParameters.Vector                 = "vector";
MapParameters.Raster                 = "raster";

MapParameters.AlphaBlend             = "AlphaBlend";
MapParameters.AlphaClip              = "AlphaClip";
MapParameters.MulBlend               = "MulBlend";

//-----------------------------------------------------------------------------------//

function MapParameters () {

   this.rasterUid    = null;
   this.contrast     = 0.0;
   this.luminosity   = 0.0;
   this.bwMethod     = 1.0;
   this.editModeOn   = true;
   this.obs          = [];
   this.colorbars    = {};
   this.style        = {};

   this.LayerOrder             = [  MapParameters.LayerBack    , MapParameters.LayerRaster         , MapParameters.LayerFront  ];
   this.LayerType              = [  MapParameters.Vector       , MapParameters.Raster              , MapParameters.Vector      ];
   this.LayerParams            = [  {"style"    : "default"   , "layerAttribute" : "back" } , 
                                    {"colorbar" : "default" } ,
                                    {"style"    : "default"   , "layerAttribute" : "front"}                                 ];
   this.ComposeShader          = [   null                     , MapParameters.MulBlend            , MapParameters.AlphaBlend   ];
   this.ComposeParams          = [   {}                       , {"uParams" : [ -0.5, -0.5, 1.0 ] } , {}                     ];
}

//---------------------------------------------------------------------------//

MapParameters.prototype.Invalidate = function (changeEvent) {
   this._Change (changeEvent) 
}

MapParameters.prototype._Change = function (changeEvent) {   // private 
   for (var i = 0 ; i < this.obs.length ; i++ ) {
      this.obs[i](changeEvent);
   }
}

MapParameters.prototype.OnChange = function (callback) {
   this.obs.push(callback);
}

MapParameters.prototype.SetStyle = function(name,style){
   if (style.constructor === String) {
      var me = this
      me.style[name] = null;
      $.ajax({
         url         : style ,
         async       : false,
         dataType    : 'json',
         success     : function (data) {
            me.style[name] = data;
         }
      });
   }
   else {
      this.style[name] = style;
   }
   this._Change(MapParameters.StyleChanged)
}

MapParameters.prototype.GetStyle = function(name){
   if (name in this.style)
      return this.style[name];
   return null;
}

MapParameters.prototype.SetColorBar = function(name,colorbar){

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
   this._Change(MapParameters.ColorBarChanged)
}

MapParameters.prototype.GetColorBars = function(){
   return this.colorbars;
}

MapParameters.prototype.GetColorBar = function(name){
   if (name in this.colorbars)
      return this.colorbars[name];
   return null;
}

MapParameters.prototype.GetMapURL = function (tx,ty,z) {
   //var url = "http://map.x-ray.fr:8180/api/tile?x="+tx+"&y="+ty+"&z="+z
   var url = "http://map.x-ray.fr:8081/api/tile?x="+tx+"&y="+ty+"&z="+z
   //var url = "http://map.x-ray.fr/api/tile?x="+tx+"&y="+ty+"&z="+z
   return url
   //Utils.altURL = ["mapsa","mapsb","mapsc","mapsc"];
   // var rd  = Math.floor( (Math.random()*4) );
   // var url = "/"+Utils.altURL[rd]+"/";
   // return url
}

MapParameters.prototype.GetRasterURL = function (tx,ty,z) {
   var url = null
   if (this.rasterUid) 
      //url = "http://map.x-ray.fr/api/tile/"+this.rasterUid+"?x="+tx+"&y="+ty+"&z="+z
      url = "http://map.x-ray.fr:8081/api/tile/"+this.rasterUid+"?x="+tx+"&y="+ty+"&z="+z
      return url
}

MapParameters.prototype.SetRasterUid = function ( inUid ) {
   this.rasterUid  = inUid
   this._Change(MapParameters.dataSrcChanged)
}

MapParameters.prototype.SetContrast = function ( v ) {
   this.contrast      = v;
   this._Change(MapParameters.ContrastChanged)
}

MapParameters.prototype.GetContrast = function ( ) {
   return this.contrast;
}

MapParameters.prototype.SetLuminosity = function ( v ) {
   this.luminosity    = v;
   this._Change(MapParameters.LuminosityChanged)
}

MapParameters.prototype.GetLuminosity = function ( ) {
   return this.luminosity;
}

MapParameters.prototype.SetBWMethod = function ( m ) {
   this.bwMethod      =  Math.max ( 0, Math.min ( 4 , Math.round ( m ) ) );
   this._Change(MapParameters.BWMethodChanged)
}

MapParameters.prototype.GetBWMethod = function ( ) {
   return this.bwMethod;
}

MapParameters.prototype.SetEditModeOn = function ( em ) {
   this.editModeOn = em
}

MapParameters.prototype.isEditModeOn = function ( ) {
   return this.editModeOn
}


//-----------------------------------------
//quand est ce quon vire ca ??
MapParameters.prototype.SetDefaultColorBar = function (){

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
   
   this.SetColorBar("default", cbData);
}
//---
