//----------------------------//

function LayerSetsHelper (maperial, mapCreationController) {
   this.maperial = maperial;
   this.mapCreationController = mapCreationController;
   this.layerBeingDraggedIndex;
}

//----------------------------//

LayerSetsHelper.TOGGLE = "toggleLayerSet";

//=============================================================================//
//Layers Panel Drawing

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
         "   <div class=\"span4 offset1\"><img class=\"selectable sourceThumb\" onclick=\"App.MapCreationController.editLayer("+layerIndex+")\" "+Utils.getSourceThumb(layer)+"></img></div>" +
         "   <div class=\"span1 offset1\"><button class=\"btn-small btn-success\" onclick=\"App.MapCreationController.customizeLayer("+layerIndex+")\"><i class=\"icon-edit icon-white\"></i></button></div>" +
         "   <div class=\"span1 offset2\"><button class=\"btn-small btn-danger\" onclick=\"App.MapCreationController.deleteLayer("+layerIndex+")\"><i class=\"icon-trash icon-white\"></i></button></div>" +
         "</div>"
   ); 

}

//=======================================================================//

LayerSetsHelper.prototype.exchangeLayers = function(){

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

/**
 * TODO (not usefull for a DEMO)
 */
LayerSetsHelper.prototype.buildDetailledSets = function(){
   $("#layerSetsDiv").empty();
}




//====================================================================================//

/**
 * Draw the compositions panel in the layerCreation screen
 */
LayerSetsHelper.prototype.refreshCompositionsPanel = function() {

   //-----------------------------------------------------//

   $("#compositionSettings").empty(); 

   if(this.maperial.config.layers.length < 2){
      $("#panelCompositionSettings").addClass("hide"); 
      return;
   }

   $("#compositionSettings").removeClass("hide"); 
   $("#compositionSettings").append("<p id=\"compositionSettingsTitle\">Compositions Settings</p>");

   //-----------------------------------------------------//

   var panelHeight = 40;
   var me = this;

   //-----------------------------------------------------//

   for(var l = (this.maperial.config.layers.length-1); l>0 ; l--){

      var composition = this.maperial.config.layers[l].composition;
      var shadersSelectionId = "shadersSelection_"+l;

      //-----------------------------------------------------//
      // layer header html

      var div = "<div class=\"row-fluid\">";
      div += "<div class=\"span3\"><img class=\"sourceThumb\" "+Utils.getSourceThumb(this.maperial.config.layers[l])+"></img></div>";

      div += "<div class=\"span4 offset1\"><select name=\""+shadersSelectionId+"\" id=\""+shadersSelectionId+"\">";

      for(var s=0; s< this.maperial.context.parameters.shaders.length; s++) 
         div += "<option value=\""+s+"\">"+this.maperial.context.parameters.shaders[s]+"</option>";

      div += "</select></div>";
      div += "</div>";

      $("#compositionSettings").append(div);

      //-----------------------------------------------------//
      // build selectbox

      $("#"+shadersSelectionId).selectbox({
         onChange: function(composition){
            return function (val, inst) {
               try{
                  composition.shader = inst.input[0][val].label;
                  me.maperial.restart();
               }
               catch(e){}
            }
         }(composition),
         effect: "slide"
      });

      // init selectbox value
      $("#"+shadersSelectionId).selectbox('change', "", composition.shader);


      if(composition.shader == MapParameters.MulBlend){

         //-----------------------------------------------------//
         // MulBlend params html 

         var constrastId = "mulblend_contrast_"+l;
         var brightnessId = "mulblend_brightness_"+l;
         var bwId = "mulblend_bw_"+l;

         var div = "<div class=\"row-fluid\">" +
         "<div class=\"span1 offset4\"><div id="+constrastId+"></div></div>" +
         "<div class=\"span1 offset1\"><div id="+brightnessId+"></div></div>" +
         "<div class=\"span1 offset1\"><div id="+bwId+"></div></div>" +
         "</div>";

         $("#compositionSettings").append(div);

         //-----------------------------------------------------//
         // MulBlend params js 

         $( "#"+constrastId ).slider({
            orientation: "vertical",
            range: "min",
            min: -2,
            max: 2,
            step: 0.01,
            value: composition.params.uParams[0],
            slide: function(constrastId){
               return function( event, ui ) {
                  $("#"+constrastId+" a").html(ui.value);
               }
            }(constrastId),
            change: function(constrastId, composition){
               return function( event, ui ) {
                  composition.params.uParams[0] = ui.value;
                  me.maperial.restart();
               }
            }(constrastId, composition)
         });

         $( "#"+brightnessId ).slider({
            orientation: "vertical",
            range: "min",
            min: -2,
            max: 2,
            step: 0.01,
            value: composition.params.uParams[1],
            slide: function(brightnessId){
               return function( event, ui ) {
                  $("#"+brightnessId+" a").html(ui.value);
               }
            }(brightnessId),
            change: function(brightnessId, composition){
               return function( event, ui ) {
                  composition.params.uParams[1] = ui.value;
                  me.maperial.restart();
               }
            }(brightnessId, composition)
         });

         $( "#"+bwId ).slider({
            orientation: "vertical",
            range: "min",
            min: 1,
            max: 4,
            step: 1,
            value: composition.params.uParams[2],
            slide: function(bwId){
               return function( event, ui ) {
                  $("#"+bwId+" a").html(ui.value);
               }
            }(bwId),
            change: function(bwId, composition){
               return function( event, ui ) {
                  composition.params.uParams[2] = ui.value;
                  me.maperial.restart();
               }
            }(bwId, composition)
         });

         panelHeight += 120;
      }
      //-----------------------------------------------------//

      panelHeight += 60;
   }

   $("#panelCompositionSettings").css("height", panelHeight+"px");
}

//=============================================================================//
//Map Settings 

/**
 * Draw the HUD Viewer Settings
 */
LayerSetsHelper.prototype.refreshHUDViewerSettings = function() {

   var me = this;
   $("#hudViewerSettings").empty(); 
   var panelHeight = 65;

   for (i in HUD.VIEWER_OPTIONS) {

      var element = HUD.VIEWER_OPTIONS[i].element;
      var label = HUD.VIEWER_OPTIONS[i].label;

      if(element == HUD.COMPOSITIONS && this.maperial.config.layers.length < 2)
         continue;
      
      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + label + "</div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\"toggleMapSettings_"+element+"\"></span>" +
      "</div>" +
      "</div>";

      $("#hudViewerSettings").append(div); 
      panelHeight += 50;

      // ----- toggle listeners

      $('#toggleMapSettings_'+element).click((function(element){
         return function(){
            if($(this).hasClass('on')){
               $(this).removeClass('on');
               me.maperial.config.hud.elements[element].show = false;
               $("#"+me.maperial.config.hud.elements[element].type+element).addClass("hide");

               if(me.maperial.config.hud.elements[element].type == HUD.TRIGGER)
                  me.maperial.hud.hideTrigger(element);
            }
            else{
               $(this).addClass('on');
               me.maperial.config.hud.elements[element].show = true;
               $("#"+me.maperial.config.hud.elements[element].type+element).removeClass("hide");
               me.maperial.hud.showTrigger(element);
            }
            
            console.log(me.maperial.config.hud);
         };
      })(element));

      if(me.maperial.config.hud.elements[element].show){
         $("#toggleMapSettings_"+element).addClass("on");
      }
   }

   $("#panelSettings").css("height", panelHeight+"px");
}














