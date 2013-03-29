
//==================================================================//

function HUD(maperial){

   console.log("  building HUD...");
   
   this.maperial = maperial;
   this.context = this.maperial.context;

   this.buildTriggers();
   this.buildControls();
   this.display();

   this.initListeners();
   this.updateScale();

}

//----------------------------------------------------------------------//
HUD.TRIGGER                = "trigger";
HUD.PANEL                  = "panel";

// hud options user only
HUD.SETTINGS               = "HUDSettings";
HUD.COLORBAR               = "ColorBar";
HUD.QUICK_EDIT             = "QuickEdit";
HUD.DETAILS_MENU           = "DetailsMenu";
HUD.ZOOMS                  = "Zooms";

// hud options user + viewer
HUD.CONTROLS               = "Controls";
HUD.SCALE                  = "Scale";
HUD.GEOLOC                 = "Geoloc";
HUD.COMPOSITIONS           = "Compositions";
HUD.LATLON                 = "LatLon";
HUD.MAPKEY                 = "MapKey";
HUD.MAGNIFIER              = "Magnifier";

//----------------------------------------------------------------------//

HUD.VIEWER_OPTIONS = {
    "0" : {element : HUD.CONTROLS,     label : "Controls",        defaultDisableDrag : true  },
    "1" : {element : HUD.SCALE,        label : "Scale",           defaultDisableDrag : false },
    "2" : {element : HUD.GEOLOC,       label : "Geoloc",          defaultDisableDrag : false },
    "3" : {element : HUD.COMPOSITIONS, label : "Compositions",    defaultDisableDrag : false },
    "4" : {element : HUD.LATLON,       label : "Lat/Lon",         defaultDisableDrag : false },
    "5" : {element : HUD.MAPKEY,       label : "Map Key",         defaultDisableDrag : false },
    "6" : {element : HUD.MAGNIFIER,    label : "Magnifier",       defaultDisableDrag : false }
}

//----------------------------------------------------------------------//

HUD.applyDefaultHUD = function(config) {
   
   config.hud = {elements:{}, options:{}};

   for (i in HUD.VIEWER_OPTIONS) {
      var element             = HUD.VIEWER_OPTIONS[i].element;
      var label               = HUD.VIEWER_OPTIONS[i].label;
      var defaultDisableDrag  = HUD.VIEWER_OPTIONS[i].defaultDisableDrag;

      config.hud.elements[element] = {show : false, type : HUD.PANEL, label : label, disableDrag : defaultDisableDrag };
   }
}

//----------------------------------------------------------------------//

HUD.positions = [];

HUD.positions[HUD.SETTINGS]      = { left  : "0",    top    : "0"   };
HUD.positions[HUD.COMPOSITIONS]  = { left  : "0",    bottom : "0"   };
HUD.positions[HUD.MAGNIFIER]     = { left  : "0",    bottom : "0"   };
HUD.positions[HUD.COLORBAR]      = { left  : "0",    top    : "180" };
HUD.positions[HUD.SCALE]         = { right : "10",   bottom : "10"  };
HUD.positions[HUD.MAPKEY]        = { right : "0",    bottom : "0"   };
HUD.positions[HUD.CONTROLS]      = { left  : "15",   top    : "40"  };
HUD.positions[HUD.LATLON]        = { left  : "50%",  bottom : "0"   };
HUD.positions[HUD.GEOLOC]        = { left  : "50%",  top    : "0"   };
HUD.positions[HUD.DETAILS_MENU]  = { left  : "50%",  top    : "30%" };
HUD.positions[HUD.QUICK_EDIT]    = { right : "0",    top    : "38", };
HUD.positions[HUD.ZOOMS]         = { left  : "50%",  bottom : "0"   };


//----------------------------------------------------------------------//

HUD.prototype.reset = function () {
   this.hideAllHUD();
   this.removeListeners();
}

//----------------------------------------------------------------------//

HUD.prototype.initListeners = function () {

   var hud = this;
   
   this.context.mapCanvas.on(MaperialEvents.UPDATE_LATLON, function(event, x, y){
      hud.updateLatLon();
   });

   $(window).on(MaperialEvents.MAP_MOVING, function(event, x, y){
      hud.updateScale();
   });

   $(window).on(MaperialEvents.ZOOM_CHANGED, function(event, x, y){
      hud.updateScale();
   });

   $(window).on(MaperialEvents.ZOOM_TO_REFRESH, function(event, x, y){
      hud.refreshZoom();
   });
}

//----------------------------------------------------------------------//

HUD.prototype.removeListeners = function () {

   this.context.mapCanvas.off(MaperialEvents.UPDATE_LATLON);
   $(window).off(MaperialEvents.MAP_MOVING);
   $(window).off(MaperialEvents.ZOOM_CHANGED);
   $(window).off(MaperialEvents.ZOOM_TO_REFRESH);
   
   $(".trigger").unbind("click");
   $(".panel").unbind("click");
   $(".trigger").unbind("dragstart");
   $(".trigger").unbind("dragstop");
   $(".panel").unbind("dragstart");
   $(".panel").unbind("dragstop");

   $( "#control-up" ).unbind("click");
   $( "#control-down" ).unbind("click");
   $( "#control-left" ).unbind("click");
   $( "#control-right" ).unbind("click");
}

//----------------------------------------------------------------------//

HUD.prototype.getMargin = function (property) {
   if(!this.maperial.config.hud.options["margin-"+property])
      return 0;
   else
      return this.maperial.config.hud.options["margin-"+property];
}

//----------------------------------------------------------------------//

HUD.prototype.placeElements = function () {

   for (element in this.maperial.config.hud.elements) {

      var position = HUD.positions[element];
      
      // position in config overrides default position
      if(this.maperial.config.hud.elements[element].position){
         position = this.maperial.config.hud.elements[element].position;
      }

      for (property in position) {
         
         var value = position[property];
         
         if(position[property].indexOf("%") == -1){
            value = parseInt(value) + this.getMargin(property);
            $("#panel"+element).css(property, value+"px");
            $("#trigger"+element).css(property, value+"px");
            continue;
         }

         var percentage = position[property].split("%")[0];
         var triggerWidth = $("#trigger"+element).width();
         var triggerHeight = $("#trigger"+element).height();
         var panelWidth = $("#panel"+element).width();
         var panelHeight = $("#panel"+element).height();

         switch(property){
            case "top":
            case "bottom":
               switch(this.maperial.config.hud.elements[element].type){
                  case HUD.PANEL    : value = (percentage/100 * this.context.mapCanvas[0].height) - panelHeight/2; break;
                  case HUD.TRIGGER  : value = (percentage/100 * this.context.mapCanvas[0].height) - triggerHeight/2; break;
               }
               break;
            case "left":
            case "right":
               switch(this.maperial.config.hud.elements[element].type){
                  case HUD.PANEL    : value = (percentage/100 * this.context.mapCanvas[0].width) - panelWidth/2; break;
                  case HUD.TRIGGER  : value = (percentage/100 * this.context.mapCanvas[0].width) - triggerWidth/2; break;
               }
               break;
         }

         value += this.getMargin(property);
         $("#panel"+element).css(property, value+"px");
         $("#trigger"+element).css(property, value+"px");
      }
   }
}

//==================================================================//

HUD.prototype.display = function(){
   this.showAllHUD();

   if(this.maperial.config.hud.elements[HUD.SETTINGS])
      this.refreshSettingsPanel();

   if(this.maperial.config.hud.elements[HUD.COMPOSITIONS])
      this.refreshCompositionsPanel();
}

//==================================================================//

/**
 * slider.change calls refreshZoom => infinite loop if no shunt !
 */
HUD.prototype.refreshZoom = function(shuntSlider){
   
   if(!shuntSlider)
      $( "#control-zoom" ).slider({value: this.context.zoom});
   
   $("#control-zoom a").html(this.context.zoom);
   $(window).trigger(MaperialEvents.ZOOM_CHANGED);
   
}

//====================================================================================//

HUD.prototype.hideAllHUD = function(){
   $(".panel").addClass("hide");
   $(".trigger").addClass("hide");
}

//------------------------------------------------//

HUD.prototype.showAllHUD = function(){

   for (element in this.maperial.config.hud.elements) {
      if(this.maperial.config.hud.elements[element].show == true){
         $("#"+this.maperial.config.hud.elements[element].type + element).removeClass("hide");
      }
   }

}

//------------------------------------------------//

HUD.prototype.putOnTop = function(element){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+element).css({ zIndex : 201 });
   $("#panel"+element).css({ zIndex : 200 });  
}
