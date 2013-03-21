//-------------------------------------------//
//- LayersManager 
//-------------------------------------------//

function LayersManager(maperial){
   this.maperial = maperial;
}

//-------------------------------------------//

LayersManager.Vector = "vector";
LayersManager.Raster = "raster";
LayersManager.Images = "images";

//-------------------------------------------//

LayersManager.prototype.addLayer = function(sourceType, params) {

   var layerConfig;
   switch(sourceType){
      case Source.MaperialOSM :
         layerConfig = this.getOSMLayerConfig(this.maperial.config.layers.length);
         break;
   
      case Source.Raster :
         var rasterUID = params[0];
         console.log(rasterUID);
         layerConfig = this.getRasterLayerConfig(rasterUID);
         break;
   
      case Source.Vector :
         layerConfig = this.getVectorLayerConfig();
         break;
   
      case Source.Images :
         layerConfig = this.getImagesLayerConfig();
         break;
   }

   console.log("layerConfig");
   console.log(layerConfig);
   this.maperial.config.layers.push(layerConfig);
   this.maperial.apply(this.maperial.config);

}

//-------------------------------------------//

LayersManager.prototype.getOSMLayerConfig = function(groupId) {
   return { 
      type: LayersManager.Vector, 
      source: {
         type: Source.MaperialOSM
      },
      params: {
         group : groupId 
      }
   }
}

//-------------------------------------------//

LayersManager.prototype.getRasterLayerConfig = function(rasterUID) {
   return { 
      type: LayersManager.Raster, 
      source: {
         type: Source.Raster,
         params: { uid : rasterUID }
      },
      params: {
         colorbar: MapParameters.DEFAULT 
      }
   }
}

//-------------------------------------------//

LayersManager.prototype.getVectorLayerConfig = function() {
   return { 
      type: LayersManager.Vector, 
      source: {
         type: Source.Vector
      },
      params: {

      }
   }
}

//-------------------------------------------//

LayersManager.prototype.getImagesLayerConfig = function() {
   return { 
      type: LayersManager.Images, 
      source: {
         type: Source.Images
      },
      params: {

      }
   }
}

//-------------------------------------------//

LayersManager.prototype.deleteLayer = function(layerIndex) {
   var layerRemoved = this.maperial.config.layers.splice(layerIndex, 1)[0];

   if(layerRemoved.source.type == Source.MaperialOSM)
      this.updateGroups(layerRemoved.params.group);

   this.maperial.apply(this.maperial.config);
}

//------------------------------------------------------------------//

LayersManager.prototype.updateGroups = function(groupRemovedId) {

   console.log("updating groups...");
   console.log(this.maperial.config.groups);

   // decremente le groupe dans la config des layers OSM, pour les layers au dessus du layer removed
   for(var i = 0; i < this.maperial.config.layers.length; i++){

      if(this.maperial.config.layers[i].source.type != Source.MaperialOSM)
         continue;

      if(this.maperial.config.layers[i].params.group > groupRemovedId)
         this.maperial.config.layers[i].params.group--;

   }

   // decremente le groupe dans le dico des groups, pour les layers au dessus du layer removed
   for(layerId in this.maperial.config.groups){
      if(this.maperial.config.groups[layerId] > groupRemovedId)
         this.maperial.config.groups[layerId]--;
   }

   console.log("after : ");
   console.log(this.maperial.config.groups);
}

//------------------------------------------------------------------//

LayersManager.prototype.buildGroups = function(style) {

   console.log("building groups for style '" + style.name + "'...");

   this.maperial.config.groups = {};

   for(layerId in style.content){
      this.maperial.config.groups[layerId] = 0;
   }
}

//------------------------------------------------------------------//

LayersManager.prototype.useDefaultLayers = function() {

   console.log("  using default layers...");
   this.maperial.config.layers = [this.getOSMLayerConfig(0)];
}

//Maperial.prototype.useDefaultLayers = function() {

//console.log("using default layers...");

//this.config.layers = [
//{ 
//type: LayersManager.Vector, 
//source: {
//type: Source.MaperialOSM
//},
//params: {
//group : VectorialLayer.BACK, 
//styles: [MapParameters.DEFAULT],
//selectedStyle: 0
//}
//},
//{ 
//type: LayersManager.Raster, 
//source: {
//type: Source.Raster,
//params: { uid : "rasterUID" }
//},
//params: {
//colorbar: MapParameters.DEFAULT, 
//},
//composition: {
//shader : MapParameters.MulBlend,
//params : { uParams : [ -0.5, -0.5, 1.0 ]}
//}
//},
//{ 
//type: LayersManager.Vector, 
//source: {
//type: Source.MaperialOSM
//},
//params: {
//group : VectorialLayer.FRONT, 
//styles: [MapParameters.DEFAULT],
//selectedStyle: 0
//},
//composition: {
//shader : MapParameters.AlphaBlend
//}
//}
//];

//}
