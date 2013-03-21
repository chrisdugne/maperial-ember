//-------------------------------------------//
//- StylesManager - note: "StyleManager" exists outside maperialJS 
//-------------------------------------------//

function StylesManager(maperial){

   this.maperial = maperial;

   this.stylesToLoad;
   this.nextFunction;

   this.styles = {}; // cache containing all previously loaded styles (see StyleLoader)
}

//-------------------------------------------//

/**
 * Quel que soit le nbre de layers OSM, il y a un seul style selectionne a la fois
 */
StylesManager.prototype.getSelectedStyle = function() {

   for(var i = 0; i < this.maperial.config.layers.length; i++){
      var layerParams = this.maperial.config.layers[i].params;
      if(layerParams.styles){
         var styleUID = layerParams.styles[layerParams.selectedStyle];
         return this.styles[styleUID];
      }
   }
   
   return null;
}

StylesManager.prototype.getStyle = function(uid){
   return this.styles[uid];
}

StylesManager.prototype.getEditedStyle = function(){
   return this.styles[this.maperial.styleMenu.styleUID];
}

//-------------------------------------------//

StylesManager.prototype.fetchStyles = function(styleUIDs, next) {

   this.nextFunction = next;

   if(styleUIDs.length > 0){
      var styleUID = styleUIDs.shift();
      this.stylesToLoad = styleUIDs;
      this.loadStyle(styleUID);
   }
   else{
      next();
   }
}

//-------------------//

StylesManager.prototype.loadStyle = function(styleUID) {

   var me = this;

   if(this.styles[styleUID]){
      this.loadNextStyle();
      return;
   }

   var styleURL = this.getURL(styleUID);
   console.log("fetching : " + styleURL);

   $.ajax({  
      type: "GET",  
      url: styleURL,
      dataType: "json",
      success: function (style) {
         me.styles[styleUID] = {uid : styleUID, name: "name_"+styleUID, content:style};
         me.loadNextStyle();
      }
   });

}

//----------------------------//

StylesManager.prototype.loadNextStyle = function() {
   this.fetchStyles(this.stylesToLoad, this.nextFunction);
}

//----------------------------//

StylesManager.prototype.refreshStyle = function(style){
   this.styles[style.uid].content = style.content;
   $(window).trigger(MaperialEvents.STYLE_CHANGED);
}

//----------------------------//

StylesManager.prototype.getURL = function(styleUID) {
   return this.maperial.config.serverURL + "/api/style/" + styleUID;
}
