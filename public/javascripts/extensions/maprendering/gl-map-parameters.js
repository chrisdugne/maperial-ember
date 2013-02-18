
function MapParameter () {
   this.style     = null;

   this.rasterUid= null;
   this.contrast  = 0.0;
   this.luminosity= 0.0;
   this.bwMethod  = 1.0;
   this.editMode  = true;
   this.obs       = [];

   this.colorbar  = [];
   for ( i = 0 ; i < 256 * 4 ; i++ ) {
      this.colorbar.push ( 0 );
   }
}

MapParameter.refreshRate            = 15; // ms
MapParameter.tileDLTimeOut          = 60000; //ms
MapParameter.tileSize               = 256;

MapParameter.autoMoveSpeedRate      = 0.2;
MapParameter.autoMoveMillis         = 700;
MapParameter.autoMoveDeceleration   = 0.005;
MapParameter.autoMoveAnalyseSize    = 10;

MapParameter.StyleChanged        = 1;
MapParameter.ColorBarChanged     = 2;
MapParameter.ContrastChanged     = 3;
MapParameter.LuminosityChanged   = 4;
MapParameter.BWMethodChanged     = 5;
MapParameter.dataSrcChanged      = 6;

MapParameter.LayerBack           = "back";
MapParameter.LayerRaster         = "raster";
MapParameter.LayerFront          = "front";
MapParameter.LayerSelect         = "select";

MapParameter.Vector              = "vector";
MapParameter.Raster              = "raster";
MapParameter.LayerOrder          = [ MapParameter.LayerBack , MapParameter.LayerRaster , MapParameter.LayerFront  ];
MapParameter.LayerType           = [ MapParameter.Vector    , MapParameter.Raster      , MapParameter.Vector      ];

MapParameter.prototype.Invalidate = function (changeEvent) {
   this._Change (changeEvent) 
}

MapParameter.prototype._Change = function (changeEvent) {   // private 
   for (var i = 0 ; i < this.obs.length ; i++ ) {
      this.obs[i](changeEvent);
   }
}

MapParameter.prototype.OnChange = function (callback) {
   this.obs.push(callback);
}

MapParameter.prototype.SetStyle = function(style){
   if (style.constructor === String) {
      var me = this
      me.style = null;
      $.ajax({
         url         : style ,
         async       : false,
         dataType    : 'json',
         success     : function (data) {
            me.style = data;
         }
      });
   }
   else {
      this.style = style;
   }
   this._Change(MapParameter.StyleChanged)
}

MapParameter.prototype.GetStyle = function(){
   return this.style;
}

MapParameter.prototype.SetColorBar = function(colorbar){
   if (this.colorbar)
      delete this.colorbar

      if (colorbar.constructor === String) {
         this.colorbar = null;
         $.ajax({
            url         : colorbar ,
            async       : false,
            dataType    : 'json',
            success     : function (data) {
               this.colorbar = new Uint8Array(data);
            }
         });
      }
      else {
         this.colorbar = new Uint8Array(colorbar);
      }
   this._Change(MapParameter.ColorBarChanged)
}

MapParameter.prototype.GetColorBar = function(){
   return this.colorbar;
}

MapParameter.prototype.GetMapURL = function (tx,ty,z) {
   //var url = "http://map.x-ray.fr:8180/api/tile?x="+tx+"&y="+ty+"&z="+z
   //var url = "http://192.168.0.1:8081/api/tile?x="+tx+"&y="+ty+"&z="+z
   var url = "http://map.x-ray.fr/api/tile?x="+tx+"&y="+ty+"&z="+z
   return url
   //Utils.altURL = ["mapsa","mapsb","mapsc","mapsc"];
   // var rd  = Math.floor( (Math.random()*4) );
   // var url = "/"+Utils.altURL[rd]+"/";
   // return url
}

MapParameter.prototype.GetRasterURL = function (tx,ty,z) {
   var url = null
   if (this.rasterUid) 
      url = "http://map.x-ray.fr/api/tile/"+this.rasterUid+"?x="+tx+"&y="+ty+"&z="+z
      return url
}

MapParameter.prototype.SetRasterUid = function ( inUid ) {
   this.rasterUid  = inUid
   this._Change(MapParameter.dataSrcChanged)
}

MapParameter.prototype.SetContrast = function ( v ) {
   this.contrast      = v;
   this._Change(MapParameter.ContrastChanged)
}

MapParameter.prototype.GetContrast = function ( ) {
   return this.contrast;
}

MapParameter.prototype.SetLuminosity = function ( v ) {
   this.luminosity    = v;
   this._Change(MapParameter.LuminosityChanged)
}

MapParameter.prototype.GetLuminosity = function ( ) {
   return this.luminosity;
}

MapParameter.prototype.SetBWMethod = function ( m ) {
   this.bwMethod      =  Math.max ( 0, Math.min ( 4 , Math.round ( m ) ) );
   this._Change(MapParameter.BWMethodChanged)
}

MapParameter.prototype.GetBWMethod = function ( ) {
   return this.bwMethod;
}

MapParameter.prototype.SetEditMode = function ( em ) {
   this.editMode = em
}

MapParameter.prototype.GetEditMode = function ( ) {
   return this.editMode
}
