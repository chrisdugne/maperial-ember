// ----------------------------//

function LayerSetsHelper (maperial, mapCreationController) {
   this.maperial = maperial;
   this.mapCreationController = mapCreationController;
   this.layerBeingDraggedIndex;
}

//----------------------------//

LayerSetsHelper.TOGGLE = "toggleLayerSet";

//=============================================================================//
// Layers Panel Drawing

/**
 * Draw the Layers panel
 */
LayerSetsHelper.prototype.refreshLayersPanel = function() {

   var me = this;
   $("#layers").empty(); 
   var panelHeight = 35;

   for(var i = App.maperial.config.layers.length - 1; i >= 0 ; i--) {
      this.buildLayerEntry(i);
      panelHeight += 64;
   }
   
   $("#layers").sortable({
      revert: true,
      delay: 200,
      start: function(event, ui){
         me.mapCreationController.preventNextEdit = true;
         me.layerBeingDraggedIndex = parseInt((ui.item[0].id).split("_")[1]);
      },
      stop: function(){
         me.mapCreationController.preventNextEdit = false;
         me.exchangeLayers();
      }
   });
   
   $("#panelLayers").css("height", panelHeight+"px");
}

//--------------------------------------//

LayerSetsHelper.prototype.buildLayerEntry = function(layerIndex) {
   
   var layer = App.maperial.config.layers[layerIndex];
   
   $("#layers").append(
         "<div class=\"row-fluid movable\" id=\"layer_"+layerIndex+"\">" +
         "   <div class=\"span4 offset1\"><img class=\"selectable sourceThumb\" onclick=\"App.MapCreationController.editLayer("+layerIndex+")\" "+this.maperial.layersManager.getSourceThumb(layer.source)+"></img></div>" +
         "   <div class=\"span1 offset1\"><button class=\"btn-small btn-success\" onclick=\"App.MapCreationController.customizeLayer("+layerIndex+")\"><i class=\"icon-edit icon-white\"></i></button></div>" +
         "   <div class=\"span1 offset2\"><button class=\"btn-small btn-danger\" onclick=\"App.MapCreationController.deleteLayer("+layerIndex+")\"><i class=\"icon-trash icon-white\"></i></button></div>" +
         "</div>"
   ); 

}

//=======================================================================//

LayerSetsHelper.prototype.exchangeLayers = function(){
   
   console.log("layer being dragged : " + this.layerBeingDraggedIndex);
   
   // layers are ordered from bottom to top
   for(var i = ($("#layers")[0].children.length - 1); i >= 0 ; i--){
      var layerIndex = $("#layers")[0].children[i].id.split("_")[1];
      var k = ($("#layers")[0].children.length-1) - i;
      
      // just found our layer in the new div list
      if(layerIndex == this.layerBeingDraggedIndex){
         if(this.layerBeingDraggedIndex == k){
            return;
         }
      }
   }

   var exchangedIds = {};
   for(var i = ($("#layers")[0].children.length - 1); i >= 0 ; i--){

      var layerIndex = $("#layers")[0].children[i].id.split("_")[1];
      var k = ($("#layers")[0].children.length-1) - i;
      
      exchangedIds[layerIndex] = k;
      $("#layer_"+layerIndex).attr("id", "layer_"+k);
      
   }

   this.maperial.layersManager.exchangeLayers(exchangedIds);
}

//=================================================================================================================//


/**
 * On/off buttons to show hide layerSets
 */
LayerSetsHelper.prototype.buildLayerSets = function(layerCustomizedIndex){
   
   var layersManager = this.maperial.layersManager;
   var container = $("#layerSetsDiv");

   container.empty();
   var panelHeight = 0;
   
   console.log(layersManager.layerSets);
   
   for (var i in layersManager.layerSets) {
      var set = layersManager.layerSets[i];

      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + set.label + "</div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\""+LayerSetsHelper.TOGGLE+i+"\"></span>" +
      "</div>" +
      "</div>";

      container.append(div); 
      panelHeight += 50;

      // ----- toggle listeners

      $('#'+LayerSetsHelper.TOGGLE+i).click(function(){
         if($(this).hasClass('on')){
            $(this).removeClass('on');
            var setIndex = $(this).context.id.replace(LayerSetsHelper.TOGGLE,"");
            layersManager.detachSet(setIndex);
         }
         else{
            $(this).addClass('on');
            var setIndex = $(this).context.id.replace(LayerSetsHelper.TOGGLE,"");
            layersManager.attachSet(setIndex, layerCustomizedIndex);
         }
      });

      if(layerCustomizedIndex == set.layerPosition)
         $("#"+LayerSetsHelper.TOGGLE+i).addClass("on");
   }

   container.css("height", panelHeight+"px");
}

//=======================================================================//

LayerSetsHelper.prototype.buildCompositionOptions = function(layerIndex){
   
   //-----------------------------------------------------//

   var maperial = this.maperial;
   var composition = this.maperial.config.layers[layerIndex].composition;

   //-----------------------------------------------------//
   
   $("#shadersDiv").empty();

   //-----------------------------------------------------//
   
   var shadersSelection = "<select name=\"shadersSelection\" id=\"shadersSelection\">";
   
   for(var i=0; i< App.Globals.shaders.length; i++) 
      shadersSelection += "<option value=\""+i+"\">"+App.Globals.shaders[i]+"</option>";
   
   shadersSelection += "</select>";
   
   $("#shadersDiv").append(shadersSelection);

   //-----------------------------------------------------//
   
   $("#shadersSelection").selectbox({
      onChange: function (val, inst) {
         try{
            composition.shader = inst.input[0][val].label;
            maperial.restart();
         }
         catch(e){}
      },
      effect: "slide"
   });
   
   $('#shadersSelection').selectbox('change', "", composition.shader);
}

//=======================================================================//

/**
 * TODO (not usefull for a DEMO)
 */
LayerSetsHelper.prototype.buildDetailledSets = function(){
   $("#layerSetsDiv").empty();
}


















