
/**
 * Draw the HUD settings panel
 */
HUD.prototype.refreshSettingsPanel = function() {

   $("#"+HUD.SETTINGS).empty(); 
   var panelHeight = 0;
   var configHUD = this.maperial.config.hud;
   var hud = this;

   for (element in configHUD.elements) {

      // ----- checking config options
      if(configHUD.elements[element].disableHide){ 
         continue;
      }  

      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + configHUD.elements[element].label + "</div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\"toggle"+element+"\"></span>" +
      "</div>" +
      "</div>";

      $("#"+HUD.SETTINGS).append(div); 
      panelHeight += 50;

      // ----- toggle listeners

      $('#toggle'+element).click(function(){
         if($(this).hasClass('on')){
            $(this).removeClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+configHUD.elements[thisElement].type+thisElement).addClass("hide");
            
            if(configHUD.elements[thisElement].type == HUD.TRIGGER)
               hud.hideTrigger(thisElement);
         }
         else{
            $(this).addClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+configHUD.elements[thisElement].type+thisElement).removeClass("hide");
            hud.showTrigger(thisElement);
         }
      });

      if(configHUD.elements[element].show){
         $("#toggle"+element).addClass("on");
      }
   }

   $("#panel"+HUD.SETTINGS).css("height", panelHeight+"px");
}