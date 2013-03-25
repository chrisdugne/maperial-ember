//-----------------------------------------------------------------------------------//

Source.MaperialOSM     = "osm";
Source.Raster          = "raster";
Source.Vector          = "vector";
Source.Images          = "images";

//-----------------------------------------------------------------------------------//

Source.IMAGES_MAPQUEST              = "images";
Source.IMAGES_MAPQUEST_SATELLITE    = "mapquest satellite";
Source.IMAGES_OSM                   = "osm";

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
      case Source.Images:
         var src = null;
         if ( this.params === undefined || this.params.src === undefined )
            src = Source.IMAGES_OSM;
         else 
            src = this.params.src;
            
         var gty = (Math.pow ( 2,z ) - 1) - ty;
         switch (src) {
         
         case Source.IMAGES_MAPQUEST :             // need to check http://developer.mapquest.com/web/products/open/map
            var r = Math.floor ( Math.random() * 4 + 1 ) % (4 + 1) // Betwen [0,4]
            return "http://otile"+r+".mqcdn.com/tiles/1.0.0/osm/"+z+"/"+tx+"/"+gty+".png";

         case Source.IMAGES_MAPQUEST_SATELLITE :   // need to check http://developer.mapquest.com/web/products/open/map
            var r = Math.floor ( Math.random() * 4 + 1 ) % (4 + 1) // Betwen [0,4]
            return "http://otile"+r+".mqcdn.com/tiles/1.0.0/sat/"+z+"/"+tx+"/"+gty+".png";
          
         case Source.IMAGES_OSM:                   // http://wiki.openstreetmap.org/wiki/Tile_usage_policy
         default :
            return "http://tile.openstreetmap.org/"+z+"/"+tx+"/"+gty+".png"
            
         // Check nokia
         
         // Unautorized :(
         //case "google satellite":
         //   return "http://khm1.google.com/kh/v=101&x="+tx+"&y="+gty+"&z="+z
         //case "google street":
         //   return "http://mt0.google.com/vt/x="+tx+"&y="+gty+"&z="+z
         }
         // http://www.neongeo.com/wiki/doku.php?id=map_servers
   }
}

//-----------------------------------------------------------------------------------//