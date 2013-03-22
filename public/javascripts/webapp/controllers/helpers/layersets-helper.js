// ----------------------------//

function LayerSetsHelper (maperial) {
   this.maperial = maperial;
}

//----------------------------//

LayerSetsHelper.TOGGLE = "toggleLayerSet";

//----------------------------//

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

      if(layerCustomizedIndex == set.group)
         $("#"+LayerSetsHelper.TOGGLE+i).addClass("on");
   }

   container.css("height", panelHeight+"px");
}

//=======================================================================//

LayerSetsHelper.prototype.buildDetailledSets = function(){
   $("#layerSetsDiv").empty();
   
}