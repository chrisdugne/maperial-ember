
//==================================================================//

function MapHUD(mapnify){

   this.config = mapnify.config;
   this.context = mapnify.context;

   this.renderTriggers();
   this.display();

   this.initListeners();
}

//----------------------------------------------------------------------//

MapHUD.prototype.initListeners = function () {

   var hud = this;
   
   this.context.mapCanvas.on(MapEvents.UPDATE_LATLON, function(event, x, y){
      hud.updateLatLon();
   });
   
}

//==================================================================//

MapHUD.prototype.reset = function(){
   this.hideAllTriggers();
}

MapHUD.prototype.display = function(){
   this.showTriggers();
   this.refreshSettings();   
}

//==================================================================//

MapHUD.prototype.renderTriggers = function(){

   //--------------------------------------------------------//

   var hud = this;

   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var name = $(this).context.id.replace("panel","");
      hud.putOnTop(name);
   });

   $(".trigger").click(function(){
      hud.clickOnTrigger($(this));
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
      $(this).css('right', 'auto');
      $(this).css('bottom', 'auto');

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

MapHUD.prototype.clickOnTrigger = function(trigger){
   console.log(trigger);
   var name = trigger[0].id.replace("trigger","");
   this.putOnTop(name);

   if (trigger.hasClass('noclick')) {
      trigger.removeClass('noclick');
   }
   else {

      if (trigger.hasClass('active')) {
         trigger.draggable("enable");
      }
      else{
         trigger.draggable("disable");
      }

      $("#icon"+name).toggle("fast");
      $("#panel"+name).toggle("fast");
      trigger.toggleClass("active");
   }
}

//------------------------------------------------//

MapHUD.prototype.refreshSettings = function() {

   $("#HUDSettings").empty(); 
   var panelHeight = 0;
   var configHUD = this.config.hud;
   var hud = this;

   for (element in configHUD) {

      // ----- testing option in config
      if(!configHUD.hasOwnProperty(element)){
         continue;
      }  

      if(configHUD[element] == HUD.DISABLED){ 
         continue;
      }  

      if(configHUD[element].visibility != HUD.OPTION){ 
         continue;
      }  

      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + configHUD[element].label + "</div>" +
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
            $("#"+configHUD[thisElement].type+thisElement).addClass("hide");
            
            if(configHUD[thisElement].type == HUD.TRIGGER)
               hud.clickOnTrigger($("#trigger"+thisElement));
         }
         else{
            $(this).addClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+configHUD[thisElement].type+thisElement).removeClass("hide");
         }
      });

      if(configHUD[element].show){
         $("#toggle"+element).addClass("on");
      }
   }

   $("#panelHUDSettings").css("height", panelHeight+"px");
}

//------------------------------------------------//

MapHUD.prototype.hideAllTriggers = function(){
   for (element in this.config.hud) {
      if(!this.config.hud.hasOwnProperty(element))
         continue;

      $("#"+this.config.hud[element].type + element).addClass("hide");
      $("#toggle"+element).removeClass('on');

      if(this.config.hud[element].type == HUD.TRIGGER)
         this.clickOnTrigger($("#trigger"+thisElement));
   }
}

//------------------------------------------------//

MapHUD.prototype.showTriggers = function(){

   for (element in this.config.hud) {
      if(!this.config.hud.hasOwnProperty(element))
         continue;

      if(this.config.hud[element].show == true){
         $("#"+this.config.hud[element].type + element).removeClass("hide");
      }
   }

   $("#triggerHUDSettings").removeClass("hide");
   
}

//------------------------------------------------//

MapHUD.prototype.putOnTop = function(name){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+name).css({ zIndex : 201 });
   $("#panel"+name).css({ zIndex : 200 });  
}

//==================================================================//

MapHUD.prototype.updateLatLon = function(){
   var mouseLatLon = this.context.coordS.MetersToLatLon(this.context.mouseM.x, this.context.mouseM.y); 
   try {
      $("#longitudeDiv").empty();
      $("#latitudeDiv").empty();
      $("#longitudeDiv").append(mouseLatLon.x);
      $("#latitudeDiv").append(mouseLatLon.y);
   }
   catch(e){}         
   return;
}

