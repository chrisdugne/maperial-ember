//-------------------------------------------//
//- LayersManager 
//-------------------------------------------//

function LayersManager(maperial){
   this.maperial = maperial;

   this.layerSets = {
         "0" : {
            label: "Roads", 
            subLayerIds:["02f", "030", "031", "032", "033", "034", "035", "036", "037", "038", "039", "03a", "03b", "03c","03d", "03e"], 
            layerPosition: -1
         },
         "1" : {
            label: "Floors", 
            subLayerIds:["001", "008", "011"],
            layerPosition: -1
         },
         "2" : {
            label: "Buildings", 
            subLayerIds:["050"],
            layerPosition: -1
         }
   };
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
      var src = params[0];
      layerConfig = this.getImagesLayerConfig(src);
      break;
   }

   console.log("layerConfig");
   console.log(layerConfig);
   this.maperial.config.layers.push(layerConfig);
   this.maperial.restart();

}

//-------------------------------------------//

LayersManager.prototype.getOSMLayerConfig = function() {
   return { 
      type: LayersManager.Vector, 
      source: {
         type: Source.MaperialOSM
      },
      params: {

      },
      composition: {
         shader : MapParameters.MulBlend,
         params : { uParams : [ -0.5, -0.5, 1.0 ]}
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
         colorbar: MapParameters.DEFAULT_COLORBAR_UID 
      },
      composition: {
         shader : MapParameters.MulBlend,
         params : { uParams : [ -0.5, -0.5, 1.0 ]}
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

      },
      composition: {
         shader : MapParameters.AlphaBlend
      }
   }
}

//-------------------------------------------//

/**
 * src : 
 *    Source.IMAGES_MAPQUEST
 *    Source.IMAGES_MAPQUEST_SATELLITE
 *    Source.IMAGES_OSM
 */
LayersManager.prototype.getImagesLayerConfig = function(src) {
   return { 
      type: LayersManager.Images, 
      source: {
         type: Source.Images,
         params: { src: src }
      },
      params: {

      },
      composition: {
         shader : MapParameters.AlphaBlend
      }
   }
}

//-------------------------------------------//

LayersManager.prototype.deleteLayer = function(layerRemovedPosition) {
   var layerRemoved = this.maperial.config.layers.splice(layerRemovedPosition, 1)[0];

   for(subLayerId in this.maperial.config.layerVisibilities){
      if(this.maperial.config.layerVisibilities[subLayerId] > layerRemovedPosition)
         this.maperial.config.layerVisibilities[subLayerId]--;
   }
   
   for(i in this.layerSets){
      if(this.layerSets[i].layerPosition > layerRemovedPosition)
         this.layerSets[i].layerPosition--;
   }
   
   this.maperial.restart();
}

//------------------------------------------------------------------//

LayersManager.prototype.buildLayerVisibilities = function(style) {

   console.log("building layer visibilities for style '" + style.name + "'...");

   this.maperial.config.layerVisibilities = {};
   var defaultLayerPosition = 0;

   for(layerId in style.content){
      this.maperial.config.layerVisibilities[layerId] = defaultLayerPosition;
   }

   for(i in this.layerSets){
      this.layerSets[i].layerPosition = defaultLayerPosition;
   }
}

//------------------------------------------------------------------//

LayersManager.prototype.useDefaultLayers = function() {
   console.log("  using default layers...");
   this.maperial.config.layers = [this.getOSMLayerConfig()];
}

//------------------------------------------------------------------//

/**
 * exchangedIds contains a mapping between old layerIndexes and the new one, after a layer reposition
 * example, with 3 layers, after moving layer0 (ui bottom) to the top (becomes layer 2) : 
 * exchangedIds = {
     {0: 1},
     {1: 2},
     {2: 0}
   } 
 */
LayersManager.prototype.exchangeLayers = function(exchangedIds) {

   var newLayers = [];
   for(id in exchangedIds){
      newLayers.push(this.maperial.config.layers[exchangedIds[id]]);
   }
   
   for(subLayerId in this.maperial.config.layerVisibilities){
      var previousPosition = this.maperial.config.layerVisibilities[subLayerId];
      console.log("subLayerId " + subLayerId + " previousPosition : " + previousPosition + " | new position : " + exchangedIds[previousPosition]);
      this.maperial.config.layerVisibilities[subLayerId] = exchangedIds[previousPosition];
   }

   for(i in this.layerSets)
      this.layerSets[i].layerPosition = exchangedIds[this.layerSets[i].layerPosition];

   this.maperial.config.layers = newLayers;
   this.maperial.restart();
}
   
//------------------------------------------------------------------//
   
LayersManager.prototype.detachSet = function(setIndex) {
   this.layerSets[setIndex].layerPosition = -1;
   
   for(var i=0;  i < this.layerSets[setIndex].subLayerIds.length; i++){
      var subLayerId = this.layerSets[setIndex].subLayerIds[i];
      console.log("detaching " + subLayerId);
      this.maperial.config.layerVisibilities[subLayerId] = -1;
   }
      
   this.maperial.restart();
}

LayersManager.prototype.attachSet = function(setIndex, layerPosition) {
   this.layerSets[setIndex].layerPosition = layerPosition;

   for(var i=0;  i < this.layerSets[setIndex].subLayerIds.length; i++){
      var subLayerId = this.layerSets[setIndex].subLayerIds[i];
      console.log("attaching " + subLayerId);
      this.maperial.config.layerVisibilities[subLayerId] = layerPosition;
   }
   
   this.maperial.restart();
}
