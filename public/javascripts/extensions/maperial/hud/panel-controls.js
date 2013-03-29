
HUD.prototype.buildControls = function(){

   var me = this;
   
   $( "#control-zoom" ).slider({
      orientation: "vertical",
      range: "min",
      min: 1,
      max: 18,
      value: this.context.zoom,
      slide: function( event, ui ) {
         $("#control-zoom a").html(ui.value);
      },
      change: function( event, ui ) {
         me.context.zoom = parseInt(ui.value);
         me.refreshZoom(true);
      }
    });
   
   $( "#control-up" ).click( function(){ $(window).trigger(MaperialEvents.CONTROL_UP); } );
   $( "#control-down" ).click( function(){ $(window).trigger(MaperialEvents.CONTROL_DOWN); } );
   $( "#control-left" ).click( function(){ $(window).trigger(MaperialEvents.CONTROL_LEFT); } );
   $( "#control-right" ).click( function(){ $(window).trigger(MaperialEvents.CONTROL_RIGHT); } );
   
   Utils.buildSliderStyle("control-zoom");

   this.refreshZoom();
}