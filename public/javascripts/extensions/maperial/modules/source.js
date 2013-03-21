//-----------------------------------------------------------------------------------//

Source.MaperialOSM     = "osm";
Source.Raster          = "raster";
Source.Vector          = "vector";
Source.Images          = "images";

//-----------------------------------------------------------------------------------//

function Source (type, params) {
   this.type = type;
   this.params = params;
   
   console.log("new source");
   console.log(this);
}

//-----------------------------------------------------------------------------------//

Source.prototype.getURL = function (tx, ty, z) {
   switch(this.type){
      case Source.MaperialOSM:
         return "http://www.maperial.com/api/tile?x="+tx+"&y="+ty+"&z="+z;
      case Source.Raster:
         return "http://map.x-ray.fr/api/tile/"+this.params.rasterUID+"?x="+tx+"&y="+ty+"&z="+z;
   }
}

//-----------------------------------------------------------------------------------//
// OLDIES TO COPY/PASTE URL

//MapParameters.prototype.GetMapURL = function (tx,ty,z) {
//   //var url = "http://map.x-ray.fr:8180/api/tile?x="+tx+"&y="+ty+"&z="+z
//   // var url = "http://map.x-ray.fr:8081/api/tile?x="+tx+"&y="+ty+"&z="+z
//   // var url = "http://map.x-ray.fr/api/tile?x="+tx+"&y="+ty+"&z="+z
//   return url
//   //Utils.altURL = ["mapsa","mapsb","mapsc","mapsc"];
//   // var rd  = Math.floor( (Math.random()*4) );
//   // var url = "/"+Utils.altURL[rd]+"/";
//   // return url
//}
//
//MapParameters.prototype.GetRasterURL = function (tx,ty,z) {
//   var url = null
//   if (this.rasterUid) 
//      //url = "http://map.x-ray.fr/api/tile/"+this.rasterUid+"?x="+tx+"&y="+ty+"&z="+z
//      url = "http://map.x-ray.fr:8081/api/tile/"+this.rasterUid+"?x="+tx+"&y="+ty+"&z="+z
//      return url
//}