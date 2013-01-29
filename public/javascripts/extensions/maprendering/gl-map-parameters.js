
function MapParameter () {
   this.style     = null;
   this.colorbar  = null;
   this.datasetSrc= null;
   this.contrast  = 0.0;
   this.luminosity= 0.0;
   this.bwMethod  = 1.0;
   
   this.obs       = [];
}

MapParameter.StyleChanged        = 1
MapParameter.ColorBarChanged     = 2
MapParameter.ContrastChanged     = 3
MapParameter.LuminosityChanged   = 4
MapParameter.BWMethodChanged     = 5

MapParameter.LayerBack           = "back"
MapParameter.LayerFront          = "Front"
MapParameter.LayerSelect         = "select"

MapParameter.prototype.Invalidate = function (changeEvent) {
   this._Change (changeEvent) 
}

MapParameter.prototype._Change = function (changeEvent) {   // private 
   this.obs.forEach(
      function(el) {
          el.call(changeEvent);
      }
   );
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
   if (colorbar.constructor === String) {
      this.colorbar = null;
      $.ajax({
         url         : colorbar ,
         async       : false,
         dataType    : 'json',
         success     : function (data) {
            this.colorbar = data;
         }
      });
   }
   else {
      this.colorbar = colorbar;
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

MapParameter.prototype.GetDatasetURL = function (tx,ty,z) {
   return None
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
