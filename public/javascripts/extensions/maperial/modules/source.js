//-----------------------------------------------------------------------------------//

Source.MaperialOSM     = "osm";
Source.Raster          = "raster";
Source.Vector          = "vector";
Source.Images          = "images";

//-----------------------------------------------------------------------------------//

function Source (type, params) {
   this.type = type;
   this.params = params;
}

//-----------------------------------------------------------------------------------//

Source.prototype.getURL = function (tx, ty, z) {
   switch(this.type){
      case Source.MaperialOSM:
         return MapParameters.serverURL + "/api/tile?x="+tx+"&y="+ty+"&z="+z;
      case Source.Raster:
         return MapParameters.serverURL + "/api/tile/"+this.params.rasterUID+"?x="+tx+"&y="+ty+"&z="+z;
   }
}

//-----------------------------------------------------------------------------------//