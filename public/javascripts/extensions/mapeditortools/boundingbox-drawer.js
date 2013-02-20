/****************************************************************************************************************** 
 * Used inside MapEditor
 * 
 *  This is a Drawer
 *  - this.map : the linked Map to get the Mover from
 *  - this.draw() : the Mover calls this method to refresh the drawings
 *  - this.resize(width, height) : the Mover calls this method to resize the drawBoard
 *  - this.pointsToMove : the Mover updates these points within the current move before to call drawer.draw()
 *
 ******************************************************************************************************************/ 
function BoundingBoxDrawer(map){

   // -> Drawer
   this.map = map;
   this.drawBoard;

   // -> states
   this.selecting = false;
   this.drawingEnabled = false;

   // -> objects
   this.currentBox;

   // -> lat/lon to center the box, (not required)
   this.centerLat;
   this.centerLon;
   this.latMin;
   this.lonMin;
   this.latMax;
   this.lonMax;

   // -> to convert selection to boundingbox
   this.topLeftPoint;
   this.bottomRightPoint;
   this.startPoint;
   this.endPoint;

   // -> used by mapMover.moveDrawers
   this.pointsToMove = []; 

   // -> parameters
   this.minSelectionSize = 20;
};

//----------------------------------------------------------------------//

/**
 * private : 
 * if this is a new drawBoard, setBoundings() will throw an error : init required to put on listeners
 * if not, just redraw the previous bounding box, and DO NOT add other listeners, the previous ones are well enough
 */
BoundingBoxDrawer.prototype.tryToRefresh = function(){

   try{
      this.draw();
   } 
   catch(e){
      return false;
   }

   return true;

}

//----------------------------------------------------------------------//

/**
 * Init Fabric on the canvas + set mouse listeners
 */
BoundingBoxDrawer.prototype.init = function(boardName){

   //------- if this is still the same drawBoard, just draw again and do not add listeners !!

   if(this.tryToRefresh())
      return;

   //------- init Fabric

   this.drawBoard = new fabric.Canvas(boardName);
   this.drawBoard.setHeight(this.map.height + App.Globals.HEADER_HEIGHT);
   this.drawBoard.setWidth(this.map.width);

   //------- startBox

   this.newStartBox();

   //------- placing mouse listeners on this = drawer

   var drawer = this;
   this.map.mover.addDrawer(drawer);

   this.drawBoard.on('mouse:down', function(options) {

      if(drawer.drawBoard.selection){
         if (! options.target) {
            drawer.selecting = true;
            drawer.startPoint = new Point(options.e.x, options.e.y);
         }
      }
      else{
         drawer.map.OnMouseDown(options.e);
      }

   });


   this.drawBoard.on('mouse:up', function(options) {

      if(drawer.drawBoard.selection){
         if(drawer.selecting){
            drawer.endPoint = new Point(options.e.x, options.e.y);
            drawer.drawNewBoundingBox();
         }
         drawer.selecting = false;
      }
      else{
         drawer.map.OnMouseUp(options.e);
      }

   });


   this.drawBoard.on('mouse:move', function(options) {
      drawer.map.OnMouseMove(options.e);
   });

   // -> object:modified happens at the end of dragging and at the end of scaling
   this.drawBoard.on('object:modified', function(options) {
      drawer.updateBoundingsFromCurrentBox();
      drawer.draw();
   });

}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.newStartBox = function(){

   //---------------------//
   // creating a simple boundingBox on the current center of the screen

   var startBoxWidth = 400;
   var startBoxHeight = 400;

   //---------------------//

   this.topLeftPoint = new Point(this.drawBoard.getWidth()/2 - startBoxWidth/2, this.drawBoard.getHeight()/2 - startBoxHeight/2) ;
   this.bottomRightPoint = new Point(this.drawBoard.getWidth()/2 + startBoxWidth/2, this.drawBoard.getHeight()/2 + startBoxHeight/2) ;
   this.boundingsHaveChanged();

   //---------------------//

   this.draw();
}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.setLatLon = function(latMin, lonMin, latMax, lonMax){
   this.latMin = latMin;
   this.latMax = latMax;
   this.lonMin = lonMin;
   this.lonMax = lonMax;

   this.centerLat = (this.latMin + this.latMax)/2;
   this.centerLon = (this.lonMin + this.lonMax)/2;

   console.log("this.centerLat " + this.centerLat);
   console.log("this.centerLon " + this.centerLon);
   console.log("this.lonMin " + this.lonMin);
   console.log("this.latMax " + this.latMax);
   console.log("this.lonMax " + this.lonMax);
}

BoundingBoxDrawer.prototype.resize = function(width, height){
   this.drawBoard.setHeight(height + App.Globals.HEADER_HEIGHT);
   this.drawBoard.setWidth(width);
   this.draw();
}

//----------------------------------------------------------------------//

/**
 * Update topLeftPoint and bottomRightPoint from the currentBox 
 * -> to have to right selection for the next draw()
 */
BoundingBoxDrawer.prototype.updateBoundingsFromCurrentBox = function () {
   // fabric top/left is at the box's center
   this.topLeftPoint.x = this.currentBox.left - this.currentBox.width*this.currentBox.scaleX/2;
   this.topLeftPoint.y = this.currentBox.top - this.currentBox.height*this.currentBox.scaleY/2;

   this.bottomRightPoint.x = this.currentBox.left + this.currentBox.width*this.currentBox.scaleX/2;
   this.bottomRightPoint.y = this.currentBox.top + this.currentBox.height*this.currentBox.scaleY/2;

   this.boundingsHaveChanged();
}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.drawNewBoundingBox = function () {

   if(Math.abs(this.endPoint.x - this.startPoint.x) < this.minSelectionSize 
         || Math.abs(this.endPoint.y - this.startPoint.y) < this.minSelectionSize ){

      // Tiny selection -> do not erase the currentBox ! And set the box active again
      this.drawBoard.setActiveObject(this.currentBox);

   }
   else{

      // new Selection = new Box 
      this.setBoundings();
      this.draw();

   }
}

//----------------------------------------------------------------------//

/**
 * Set the topLeftPoint and the bottomRightPoint of the new Boundingbox
 */
BoundingBoxDrawer.prototype.setBoundings = function () {

   // drag vers la droite
   if(this.startPoint.x < this.endPoint.x){

      // drag vers le bas
      if(this.startPoint.y < this.endPoint.y){

         this.topLeftPoint = new Point(this.startPoint.x, this.startPoint.y);
         this.bottomRightPoint = new Point(this.endPoint.x, this.endPoint.y);

         // drag vers le haut
      }else{

         this.topLeftPoint = new Point(this.startPoint.x, this.endPoint.y);
         this.bottomRightPoint = new Point(this.endPoint.x, this.startPoint.y);

      }

      // drag vers la gauche
   }else{

      // drag vers le bas
      if(this.startPoint.y < this.endPoint.y){

         this.topLeftPoint = new Point(this.endPoint.x, this.startPoint.y);
         this.bottomRightPoint = new Point(this.startPoint.x, this.endPoint.y);

         // drag vers le haut
      }else{

         this.topLeftPoint = new Point(this.endPoint.x, this.endPoint.y);
         this.bottomRightPoint = new Point(this.startPoint.x, this.startPoint.y);

      }
   }

   this.boundingsHaveChanged();

   console.log("box from [" + this.topLeftPoint.x + " | " + this.topLeftPoint.y + "] to [" + this.bottomRightPoint.x + " | " + this.bottomRightPoint.y + "]");   
}

//----------------------------------------------------------------------//

/**
 * Draw the new Bounding Box using topLeftPoint and bottomRightPoint
 * Note Rect.top/left offset : origin du repere de fabric est au centre des objets : (pour faciliter les calculs de pivots)
 */
BoundingBoxDrawer.prototype.draw = function () {

   // --------------------------------------------//

   this.drawBoard.clear();

   // --------------------------------------------//

   var w = this.bottomRightPoint.x - this.topLeftPoint.x;
   var h = this.bottomRightPoint.y - this.topLeftPoint.y;

   // --------------------------------------------//

   var rect = new fabric.Rect({
      width: w,
      height: h,
      top: this.topLeftPoint.y + h/2,
      left: this.topLeftPoint.x + w/2,
      fill: 'rgba(0,0,0,0)'
   });

   // --------------------------------------------//

   var rectTop = new fabric.Rect({
      width: this.drawBoard.getWidth(),
      height: this.topLeftPoint.y,
      top: this.topLeftPoint.y/2,
      left: this.drawBoard.getWidth()/2,
      fill: 'rgba(0,0,0,0.7)',
      selectable: false,
      hasControls: false
   });

   var rectBottomHeight = this.drawBoard.getHeight() - this.topLeftPoint.y - h;
   var rectBottom = new fabric.Rect({
      width: this.drawBoard.getWidth(),
      height: rectBottomHeight,
      top: this.drawBoard.getHeight() - rectBottomHeight/2,
      left: this.drawBoard.getWidth()/2,
      fill: 'rgba(0,0,0,0.7)',
      selectable: false,
      hasControls: false
   });

   var rectLeft = new fabric.Rect({
      width: this.topLeftPoint.x,
      height: h,
      top: this.topLeftPoint.y + h/2,
      left: this.topLeftPoint.x/2,
      fill: 'rgba(0,0,0,0.7)',
      selectable: false,
      hasControls: false
   });

   var rectRightWidth = this.drawBoard.getWidth() - this.topLeftPoint.x - w;
   var rectRight = new fabric.Rect({
      width: rectRightWidth,
      height: h,
      top: this.topLeftPoint.y + h/2,
      left: this.drawBoard.getWidth() - rectRightWidth/2,
      fill: 'rgba(0,0,0,0.7)',
      selectable: false,
      hasControls: false
   });

   this.drawBoard.add(rectLeft);
   this.drawBoard.add(rectRight);
   this.drawBoard.add(rectTop);
   this.drawBoard.add(rectBottom);
   this.drawBoard.add(rect);

   // --------------------------------------------//

   this.currentBox = this.drawBoard.item(4);

   this.currentBox.lockRotation = true;
   this.currentBox.hasRotatingPoint = false;
   this.currentBox.set({
      borderColor: 'black',
      cornerColor: 'black',
      cornersize: 5
   });


   // --------------------------------------------//

   this.drawBoard.selection = this.drawingEnabled;
   this.currentBox.selectable = this.drawingEnabled;
   this.currentBox.hasControls = this.drawingEnabled;

   if(this.drawingEnabled)
      this.drawBoard.setActiveObject(this.currentBox);

}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.boundingsHaveChanged = function () {
   this.refreshLatLon();
   this.pointsToMove = [this.topLeftPoint, this.bottomRightPoint];
}

/**
 * refresh all lat/lon data from topLeftPoint and bottomRightPoint
 */
BoundingBoxDrawer.prototype.refreshLatLon = function(){

   var centerP = this.map.coordS.MetersToPixels(this.map.centerM.x, this.map.centerM.y, this.map.zoom);

   var topLeftMeters = this.map.coordS.PixelsToMeters(centerP.x - (this.drawBoard.getWidth()/2 - this.topLeftPoint.x), centerP.y - (this.drawBoard.getHeight()/2 - this.topLeftPoint.y), this.map.zoom);
   var bottomRightMeters = this.map.coordS.PixelsToMeters(centerP.x + (this.bottomRightPoint.x - this.drawBoard.getWidth()/2), centerP.y + (this.bottomRightPoint.y - this.drawBoard.getHeight()/2), this.map.zoom);

   var topLeftLatLon = this.map.coordS.MetersToLatLon(topLeftMeters.x, topLeftMeters.y);
   var bottomRightLatLon = this.map.coordS.MetersToLatLon(bottomRightMeters.x, bottomRightMeters.y);

   this.setLatLon(topLeftLatLon.x, topLeftLatLon.y, bottomRightLatLon.x, bottomRightLatLon.y);

}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.center = function () {
   this.testZoom(this.map.zoom);
}

BoundingBoxDrawer.prototype.testZoom = function (zoom) {

   console.log("test zoom " + zoom);

   var topLeftMeters = this.map.coordS.LatLonToMeters(this.latMin, this.lonMin); 
   var bottomRightMeters = this.map.coordS.LatLonToMeters(this.latMax, this.lonMax);
   var centerP = this.map.coordS.MetersToPixels(this.map.centerM.x, this.map.centerM.y, zoom);

   var topLeftP = this.map.coordS.MetersToPixels(topLeftMeters.x, topLeftMeters.y, zoom);
   var bottomRightP = this.map.coordS.MetersToPixels(bottomRightMeters.x, bottomRightMeters.y, zoom);

   var shiftLeft = topLeftP.x - centerP.x;
   var shiftTop = topLeftP.y - centerP.y;
   var shiftRight = bottomRightP.x - centerP.x;
   var shiftBottom = bottomRightP.y - centerP.y;

   this.topLeftPoint = new Point(this.drawBoard.getWidth()/2 + shiftLeft, this.drawBoard.getHeight()/2 + shiftTop) ;
   this.bottomRightPoint = new Point(this.drawBoard.getWidth()/2 + shiftRight, this.drawBoard.getHeight()/2 + shiftBottom) ;

   console.log("topLeftPoint " + this.topLeftPoint.x + " | " + this.topLeftPoint.y);
   console.log("bottomRightPoint " + this.bottomRightPoint.x + " | " + this.bottomRightPoint.y);

   if(this.topLeftPoint.x < 0 
         || this.bottomRightPoint.x > this.drawBoard.getWidth()
         || this.topLeftPoint.y < 0
         || this.bottomRightPoint.y > this.drawBoard.getHeight()){
      this.testZoom(zoom - 1);
   }
   else{
      this.boundingsHaveChanged();
      this.map.SetZoom(zoom);
      this.draw();
   }
}

//----------------------------------------------------------------------//

BoundingBoxDrawer.prototype.deactivateDrawing = function () {
   this.drawingEnabled = false;
   this.draw();
}

BoundingBoxDrawer.prototype.activateDrawing = function () {
   this.drawingEnabled = true;
   this.draw();
}

//----------------------------------------------------------------------//