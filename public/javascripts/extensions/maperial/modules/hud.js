
//==================================================================//

function HUD(maperial){

   console.log("  building HUD...");
   
   this.maperial = maperial;
   this.maperial.config = this.maperial.config;
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

HUD.SETTINGS               = "HUDSettings";
HUD.COMPOSITIONS           = "Compositions";
HUD.MAGNIFIER              = "Magnifier";
HUD.COLORBAR               = "ColorBar";
HUD.LATLON                 = "LatLon";
HUD.SCALE                  = "Scale";
HUD.MAPKEY                 = "MapKey";
HUD.CONTROLS               = "Controls";
HUD.GEOLOC                 = "Geoloc";
HUD.DETAILS_MENU           = "DetailsMenu";
HUD.QUICK_EDIT             = "QuickEdit";
HUD.ZOOMS                  = "Zooms";

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

HUD.prototype.reset = function(){
   this.hideAllHUD();
}

HUD.prototype.display = function(){
   this.showAllHUD();
   this.refreshSettingsPanel();   
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

//--------------------------------------------------------//

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

//====================================================================================//

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

//====================================================================================//

/**
* Draw the compositions panel
*/
HUD.prototype.refreshCompositionsPanel = function() {
   
   //-----------------------------------------------------//

   $("#"+HUD.COMPOSITIONS).empty(); 

   if(this.maperial.config.layers.length < 2){
      $("#panel"+HUD.COMPOSITIONS).addClass("hide"); 
      return;
   }
      
   $("#"+HUD.COMPOSITIONS).removeClass("hide"); 
   $("#"+HUD.COMPOSITIONS).append("<p id=\"compositionSettingsTitle\">Compositions Settings</p>");

   //-----------------------------------------------------//

   var panelHeight = 40;
   var hud = this;

   //-----------------------------------------------------//

   for(var l = (this.maperial.config.layers.length-1); l>0 ; l--){
      
      var composition = this.maperial.config.layers[l].composition;

      //-----------------------------------------------------//
      // layer header html
      
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span4 offset1\"><img class=\"sourceThumb\" "+Utils.getSourceThumb(this.maperial.config.layers[l])+"></img></div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\"toggleLayerComposition"+l+"\"></span>" +
      "</div>" +
      "</div>";

      $("#"+HUD.COMPOSITIONS).append(div);
      
      //-----------------------------------------------------//
      // selectbox html
      
      var shadersSelectionId = "shadersSelection_"+l;
      var shadersSelection = "<div class=\"row-fluid\">";
      shadersSelection += "<div class=\"paramName span3 offset1\">Shader: </div>";
      shadersSelection += "<div class=\"span4 offset1\"><select name=\""+shadersSelectionId+"\" id=\""+shadersSelectionId+"\">";
      
      for(var s=0; s< this.maperial.context.parameters.shaders.length; s++) 
         shadersSelection += "<option value=\""+s+"\">"+this.maperial.context.parameters.shaders[s]+"</option>";
      
      shadersSelection += "</select></div>";
      shadersSelection += "</div>";
      
      $("#"+HUD.COMPOSITIONS).append(shadersSelection);

      //-----------------------------------------------------//
      // build selectbox
      
      $("#"+shadersSelectionId).selectbox({
         onChange: function(composition){
            return function (val, inst) {
               try{
                  composition.shader = inst.input[0][val].label;
                  hud.maperial.restart();
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
                  composition.params.uParams[0] = ui.value;
                  hud.maperial.restart();
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
                  hud.maperial.restart();
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
                  hud.maperial.restart();
               }
            }(bwId, composition)
         });

         panelHeight += 140;
      }
      //-----------------------------------------------------//
      
      panelHeight += 120;
   }

   $("#panel"+HUD.COMPOSITIONS).css("height", panelHeight+"px");
}

//====================================================================================//

HUD.prototype.hideAllHUD = function(){
   for (element in this.maperial.config.hud.elements) {
      $("#"+this.maperial.config.hud[element].type + element).addClass("hide");
      $("#toggle"+element).removeClass('on');

      if(this.maperial.config.hud.elements[element].type == HUD.TRIGGER)
         this.hideTrigger(element);
   }
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

//==================================================================//

HUD.prototype.updateLatLon = function(){
   var mouseLatLon = this.context.coordS.MetersToLatLon(this.context.mouseM.x, this.context.mouseM.y); 
   try {
      $("#longitudeDiv").empty();
      $("#latitudeDiv").empty();
      $("#longitudeDiv").append(mouseLatLon.x);
      $("#latitudeDiv").append(mouseLatLon.y);
   }
   catch(e){}         
}

//==================================================================//

HUD.ZOOM_METERS = { 
    "1" : "15500000",
    "2" : "4000000",
    "3" : "2000000",
    "4" : "1000000",
    "5" : "500000",
    "6" : "250000",
    "7" : "125000",
    "8" : "60000",
    "9" : "30000",
    "10" : "15000",
    "11" : "8000",
    "12" : "4000",
    "13" : "2000",
    "14" : "1000",
    "15" : "500",
    "16" : "250",
    "17" : "100",
    "18" : "50"
};

HUD.prototype.updateScale = function(){

   var pointM = new Point(this.context.centerM.x + parseInt(HUD.ZOOM_METERS[this.context.zoom]) , this.context.centerM.y ); 
   var centerP = this.context.coordS.MetersToPixelsAccurate(this.context.centerM.x, this.context.centerM.y, this.context.zoom); 
   var pointP = this.context.coordS.MetersToPixelsAccurate(pointM.x, pointM.y, this.context.zoom); 

   var nbPixelsForMeters = pointP.x - centerP.x;
   var nbPixelsForMiles = nbPixelsForMeters * 0.62137;

   // ft = m * 3.2808
   // mi = km * 0.62137
   // For miles, divide km by 1.609344
   
   var meters = HUD.ZOOM_METERS[this.context.zoom];
   var miles = HUD.ZOOM_METERS[this.context.zoom] * 0.00062137;
   
   try {
      $("#metersContainer").empty();
      $("#milesContainer").empty();
      
      $("#metersContainer").append(meters + "m");  
      $("#milesContainer").append(miles + "mi");  

      $("#metersContainer").width(nbPixelsForMeters+"px");  
      $("#milesContainer").width(nbPixelsForMiles+"px");  
   }
   catch(e){}
   
}


