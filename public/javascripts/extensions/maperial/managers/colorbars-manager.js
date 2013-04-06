//-------------------------------------------//
//- ColorbarsManager - note: "ColorbarManager" exists as webapp.managers.colorbarManager...
//-------------------------------------------//

function ColorbarsManager(maperial){

   this.maperial = maperial;

   this.colorbarsToLoad;
   this.nextFunction;

   window.maperialColorbars = window.maperialColorbars || {};  // cache containing all previously loaded colorbars
}

//-------------------------------------------//

ColorbarsManager.prototype.colorbarCacheEmpty = function() {
   return $.isEmptyObject(window.maperialColorbars);   
}

//-------------------------------------------//

ColorbarsManager.prototype.getSelectedColorbar = function(layerIndex) {

   var layerParams = this.maperial.config.layers[layerIndex].params;
   if(layerParams.colorbars){
      var colorbarUID = layerParams.colorbars[layerParams.selectedColorbar];
      return window.maperialColorbars[colorbarUID];
   }
   
   return null;
}

ColorbarsManager.prototype.getColorbar = function(uid){
   return window.maperialColorbars[uid];
}

//-------------------------------------------//

ColorbarsManager.prototype.fetchColorbars = function(colorbarUIDs, next) {

   this.nextFunction = next;

   if(colorbarUIDs.length > 0){
      var colorbarUID = colorbarUIDs.shift();
      this.colorbarsToLoad = colorbarUIDs;
      this.loadColorbar(colorbarUID);
   }
   else{
      next();
   }
}

//-------------------//

ColorbarsManager.prototype.loadColorbar = function(colorbarUID) {

   var me = this;

   if(window.maperialColorbars[colorbarUID]){
      this.loadNextColorbar();
      return;
   }

   var colorbarURL = this.getURL(colorbarUID);
//   colorbarURL = "http://serv.x-ray.fr/project/mycarto/wwwClient/colorbar/colorbar.json";
   console.log("  fetching : " + colorbarURL);

   $.ajax({  
      type: "GET",  
      url: colorbarURL,
      dataType: "json",
      success: function (colorbar) {
         window.maperialColorbars[colorbarUID] = {uid : colorbarUID, name: colorbarUID, content:colorbar};
         me.loadNextColorbar();
      }
   });

}

//----------------------------//

ColorbarsManager.prototype.loadNextColorbar = function() {
   this.fetchColorbars(this.colorbarsToLoad, this.nextFunction);
}

//----------------------------//

ColorbarsManager.prototype.getURL = function(colorbarUID) {
   return MapParameters.serverURL + "/api/colorbar/" + colorbarUID;
}
