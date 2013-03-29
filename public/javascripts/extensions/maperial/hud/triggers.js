
HUD.prototype.buildTriggers = function(){

   //--------------------------------------------------------//

   var hud = this;

   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var element = $(this).context.id.replace("panel","");
      hud.putOnTop(element);
   });

   $(".trigger").click(function(){
      hud.clickOnTrigger($(this));
      return false;
   });

   //--------------------------------------------------------//
   // Dragging

   //-----------------
   // snapping

   $( ".panel" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   $( ".trigger" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });

   //------------------
   // disable dragging

   for (element in this.maperial.config.hud.elements) {

      if(this.maperial.config.hud.elements[element].disableDrag){ 
         $( "#panel"+element ).draggable( 'disable' );
         $( "#trigger"+element ).draggable( 'disable' );
      }

   }

   //---------------
   // panels

   $( ".panel" ).bind('dragstart',function( event ){

      var id = $(this).context.id;
      var element = id.replace("panel","");

      hud.putOnTop(element);

      // hide the close button
      $("#trigger"+element).css({
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
      var element = id.replace("panel","");
      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");

      $("#trigger"+element).css({
         top: newTop,
         left: newLeft,
         opacity : 1
      });

   });

   //---------------
   // triggers

   $( ".trigger" ).bind('dragstart',function( event ){
      $(this).addClass('beingdrag');
      $(this).css('right', 'auto');
      $(this).css('bottom', 'auto');

      var element = $(this).context.id.replace("trigger","");
      hud.putOnTop(element);
   });

   $( ".trigger" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var element = id.replace("trigger","");

      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");
      $("#panel"+element).css({
         top: newTop,
         left: newLeft
      });

   });

}

//------------------------------------------------//

HUD.prototype.showTrigger = function(element){
   $("#icon"+element).show("fast");
   $("#trigger"+element).removeClass("active");
}

//------------------------------------------------//

HUD.prototype.hideTrigger = function(element){
   $("#icon"+element).hide("fast");
   $("#panel"+element).hide("fast");
   $("#trigger"+element).addClass("active");
}

//------------------------------------------------//

HUD.prototype.clickOnTrigger = function(trigger){
   var element = trigger[0].id.replace("trigger","");
   this.putOnTop(element);

   if (trigger.hasClass('beingdrag')) {
      trigger.removeClass('beingdrag');
   }
   else {

      if (trigger.hasClass('active') && !this.maperial.config.hud.elements[element].disableDrag) {
         trigger.draggable("enable");
      }
      else{
         trigger.draggable("disable");
      }

      $("#icon"+element).toggle("fast");
      $("#panel"+element).toggle("fast");
      trigger.toggleClass("active");
   }
}
