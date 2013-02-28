
//==================================================================//

function MapHUD(mapnify){

   console.log("building a new HUD");
   
   this.config = mapnify.config;
   this.context = mapnify.context;

   this.renderTriggers();
   this.display();
}

//==================================================================//

MapHUD.prototype.reset = function(){
   this.hideAllTriggers();
}

MapHUD.prototype.display = function(){
   console.log("display hud");
   this.showTriggers();
   this.refreshSettings();   
}

//==================================================================//

MapHUD.prototype.renderTriggers = function(){

   console.log("renderTriggers");

   //--------------------------------------------------------//

   var hud = this;

   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var name = $(this).context.id.replace("panel","");
      hud.putOnTop(name);
   });

   $(".trigger").click(function(){

      var name = $(this).context.id.replace("trigger","");
      hud.putOnTop(name);

      if ($(this).hasClass('noclick')) {
         $(this).removeClass('noclick');
      }
      else {

         if ($(this).hasClass('active')) {
            $(this).draggable("enable");
         }
         else{
            $(this).draggable("disable");
         }

         $("#icon"+name).toggle("fast");
         $("#panel"+name).toggle("fast");
         $(this).toggleClass("active");
      }

      return false;
   });

   //--------------------------------------------------------//
   // Dragging

   //---------------
   // snapping

   $( ".panel" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   $( ".trigger" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });

   //---------------
   // panels

   $( ".panel" ).bind('dragstart',function( event ){

      var id = $(this).context.id;
      var name = id.replace("panel","");

      hud.putOnTop(name);

      // hide the close button
      $("#trigger"+name).css({
         opacity : 0
      });
   });


   // --  preventing dragstart when scrolling the detailsMenu using scrollBar
   // note : bug when scrolling then trying immediately to drag..the user must dragstart twice
   $( "#panelDetailsMenu" ).bind('dragstart',function( event ){
      if(event.srcElement.id == "panelDetailsMenu"){

         // show the close button
         $("#triggerDetailsMenu").css({
            opacity : 1
         });

         return false;
      }   
   });

   $( ".panel" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("panel","");
      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");

      $("#trigger"+name).css({
         top: newTop,
         left: newLeft,
         opacity : 1
      });

   });

   //---------------
   // triggers

   $( ".trigger" ).bind('dragstart',function( event ){
      $(this).addClass('noclick');

      var name = $(this).context.id.replace("trigger","");
      hud.putOnTop(name);
   });

   $( ".trigger" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("trigger","");

      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");
      $("#panel"+name).css({
         top: newTop,
         left: newLeft
      });

   });

}

//------------------------------------------------//

MapHUD.prototype.refreshSettings = function() {

   console.log("hud.refreshSettings");
   $("#HUDSettings").empty(); 
   var panelHeight = 0;
   var hud = this;

   for (element in this.config.hud) {

      // ----- testing option in config
      if(!this.config.hud.hasOwnProperty(element))
         continue;

      if(this.config.hud[element] == "disabled")
         continue;

      if(this.config.hud[element].visibility != "option")
         continue;

      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + this.config.hud[element].label + "</div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\"toggle"+element+"\"></span>" +
      "</div>" +
      "</div>";

      $("#HUDSettings").append(div); 
      panelHeight += 50;

      // ----- toggle listeners

      $('#toggle'+element).click(function(){
         if($(this).hasClass('on')){
            $(this).removeClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+hud.config[thisElement].type+thisElement).addClass("hide");
            if(hud.config[thisElement].type == "trigger")
               $("#panel"+thisElement).hide("fast");
         }
         else{
            $(this).addClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+hud.config[thisElement].type+thisElement).removeClass("hide");
         }
      });

      if(this.config.hud[element].show){
         $("#toggle"+element).addClass("on");
      }
   }

   $("#panelHUDSettings").css("height", panelHeight+"px");


}

//------------------------------------------------//

MapHUD.prototype.hideAllTriggers = function(){
   console.log("hideAllTriggers");
   for (element in this.config.hud) {
      if(!this.config.hud.hasOwnProperty(element))
         continue;

      $("#"+this.config.hud[element].type + element).addClass("hide");
      $("#toggle"+element).removeClass('on');

      if(this.config.hud[element].type == "trigger")
         $("panel"+element).hide("fast");
   }
}

//------------------------------------------------//

MapHUD.prototype.showTriggers = function(){
   console.log("showTriggers");

   for (element in this.config.hud) {
      if(!this.config.hud.hasOwnProperty(element))
         continue;

      if(this.config.hud[element].show == true){
         $("#"+this.config.hud[element].type + element).removeClass("hide");
      }
   }

   $("#triggerHUDSettings").removeClass("hide");
   
   console.log("/showTriggers");
}

//------------------------------------------------//

MapHUD.prototype.putOnTop = function(name){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+name).css({ zIndex : 201 });
   $("#panel"+name).css({ zIndex : 200 });  
}
