/**
 * Draw the compositions panel in the layerCreation screen
 */
HUD.prototype.refreshCompositionsPanel = function() {

   console.log("     building compositions...");

   //-----------------------------------------------------//

   $("#"+HUD.COMPOSITIONS).empty();

   //-----------------------------------------------------//
   
   if(this.maperial.config.layers.length < 2){
      $("#panel"+HUD.COMPOSITIONS).addClass("hide"); 
      return;
   }

   //-----------------------------------------------------//

   $("#"+HUD.COMPOSITIONS).removeClass("hide"); 
   $("#"+HUD.COMPOSITIONS).append("<p id=\"compositionSettingsTitle\">Compositions Settings</p>");

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

      div += "<div class=\"span4 offset1\"><select class=\"shaderSelectbox\" name=\""+shadersSelectionId+"\" id=\""+shadersSelectionId+"\">";

      for(var s=0; s< this.maperial.context.parameters.shaders.length; s++) 
         div += "<option value=\""+s+"\">"+this.maperial.context.parameters.shaders[s]+"</option>";

      div += "</select></div>";
      div += "</div>";

      $("#"+HUD.COMPOSITIONS).append(div);

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
         "<div class=\"span1 offset4\"><div class=\"mulblendSlider\" id="+constrastId+"></div></div>" +
         "<div class=\"span1 offset1\"><div class=\"mulblendSlider\" id="+brightnessId+"></div></div>" +
         "<div class=\"span1 offset1\"><div class=\"mulblendSlider\" id="+bwId+"></div></div>" +
         "</div>";

         $("#"+HUD.COMPOSITIONS).append(div);

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
                  console.log(event);
                  console.log(ui);
                  console.log(ui.value);
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

   $("#panel"+HUD.COMPOSITIONS).css("height", panelHeight+"px");
}