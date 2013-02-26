//==================================================================//

function MapListener(config){

   this.config = config;
   this.mouseDown          = false;
   this.mouseM             = this.centerM;
   this.mouseP             = null;
   this.lastWheelMillis    = new Date().getTime();

   this.initListeners();
}

//==================================================================//

MapListener.prototype.initListeners = function (event) {

   this.config.mapCanvas.resize( 
         Utils.bindObjFuncEvent ( this , "OnResize" ) 
   ).mousedown( 
         Utils.bindObjFuncEvent ( this , "OnMouseDown" ) 
   ).mouseup (
         Utils.bindObjFuncEvent ( this , "OnMouseUp" ) 
   ).mousemove (
         Utils.bindObjFuncEvent ( this , "OnMouseMove" )
   ).mouseleave (
         Utils.bindObjFuncEvent ( this , "OnMouseLeave" ) 
   ).bind('mousewheel', Utils.bindObjFuncEvent2 ( this , "OnMouseWheel") );   

}

//==================================================================//

MapListener.prototype.OnMouseDown = function (event) {
   this.config.mapCanvas.trigger(MapEvents.OnMouseDown, [event.clientX, event.clientY]);
}

MapListener.prototype.OnMouseLeave = function (event) {
   if(this.mouseDown)
      this.OnMouseUp(event);
}

MapListener.prototype.OnMouseUp = function (event) {
   this.mouseDown = false; 
   this.config.mapCanvas.trigger(MapEvents.OnMouseUp, [event.clientX, event.clientY]);
}

MapListener.prototype.OnMouseMove = function (event) {

   // refresh magnifier
   this.mouseP = Utils.getPoint(event);
   this.mouseM = this.convertCanvasPointToMeters ( this.mouseP );

   if (!this.mouseDown){
      var mouseLatLon = this.config.coordS.MetersToLatLon(this.mouseM.x, this.mouseM.y); 
      try {
         App.Globals.set("longitude", mouseLatLon.x);
         App.Globals.set("latitude", mouseLatLon.y);
      }
      catch(e){}         
      return;

   }

   // dragging
   this.config.mapCanvas.trigger(MapEvents.OnMouseMove, [event.clientX, event.clientY]);
}

MapListener.prototype.OnMouseWheel = function (event, delta) {

   if(this.hasJustWheeled())
      return;

   this.lastWheelMillis = new Date().getTime();

   if (delta > 0) {
      this.config.map.zoom = Math.min(18, this.config.map.zoom + 1);
      this.centerM = this.convertCanvasPointToMeters(this.mouseP);
   }
   else if (delta < 0) {

      var centerP = this.config.coordS.MetersToPixels(this.centerM.x, this.centerM.y, this.config.map.zoom);
      var oldShiftP = new Point( this.config.map.width/2 - this.mouseP.x , this.config.map.height()/2 - this.mouseP.y);

      this.config.map.zoom = Math.max(0, this.config.map.zoom - 1);

      var r = this.config.coordS.Resolution ( this.config.map.zoom );
      var newShiftM = new Point(oldShiftP.x * r, oldShiftP.y * r);
      this.centerM = new Point(this.mouseM.x + newShiftM.x, this.mouseM.y - newShiftM.y);
   }

   // refresh mouse
   this.mouseP = Utils.getPoint(event);
   this.mouseM = this.convertCanvasPointToMeters ( this.mouseP );
}
//----------------------------------------------------------------------//
//Utils

MapListener.prototype.hasJustWheeled = function () {
   return new Date().getTime() - this.lastWheelMillis < 1300;
}

/**
 * param  mouseP : Point with coordinates in pixels, in the Canvas coordinates system
 * return mouseM : Point with coordinates in meters, in the Meters coordinates system
 */
MapListener.prototype.convertCanvasPointToMeters = function (canvasPoint) {

   // distance en pixels par rapport au centre
// var w = this.mapElement.width ();
// var h = this.mapElement.height();

   var w = this.width;
   var h = this.height;

   var centerP = this.config.coordS.MetersToPixels(this.config.map.centerM.x, this.config.map.centerM.y, this.config.map.zoom);
   var shiftX = w/2 - canvasPoint.x;
   var shiftY = h/2 - canvasPoint.y;
   var pointM = this.config.coordS.PixelsToMeters(centerP.x - shiftX, centerP.y + shiftY, this.config.map.zoom);

   return pointM;
}