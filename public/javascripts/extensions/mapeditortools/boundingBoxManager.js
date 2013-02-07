
//----------------------------------------------------------------------//

/** Used inside MapEditor */
function BoundingBoxManager(map){
   this.drawBoard;
   this.map = map;
   this.selecting = false;
   this.topLeftPoint;
   this.bottomRightPoint;
   this.startPoint;
   this.endPoint;
};

//----------------------------------------------------------------------//

/**
 * private : 
 * if this is a new drawBoard, createBoundingBox() will throw an error : init required to put on listeners
 * if not, jsut redraw the previous bounding box, and DO NOT add other listeners, the previous ones are well enough
 */
BoundingBoxManager.prototype.tryToRefresh = function(){
   console.log("tryToRefresh");
   try{
      console.log("clear");
      this.drawBoard.clear();
      console.log("create");
      this.createBoundingBox();
      console.log("draw");
      this.drawBoundingBox();
      console.log("ok!");
      return true;
   }
   catch(e){
      console.log("require init");
      return false;
   }
}

//----------------------------------------------------------------------//

/**
 * Init Fabric on the canvas + set mouse listeners
 */
BoundingBoxManager.prototype.init = function(boardName, width, height){

   //------- if this is still the same drawBoard, just draw again and do not add listeners !!

   if(this.tryToRefresh())
      return;
   
   //------- init Fabric

   this.drawBoard = new fabric.Canvas(boardName);
   this.drawBoard.setHeight(height);
   this.drawBoard.setWidth(width);

   //------- placing mouse listeners on this = manager

   var manager = this;
   this.drawBoard.on('mouse:down', function(options) {
      if (! options.target) {
         manager.selecting = true;
         manager.startPoint = new Point(options.e.x, options.e.y);
      }
   });

   this.drawBoard.on('mouse:up', function(options) {
      if(manager.selecting){
         manager.endPoint = new Point(options.e.x, options.e.y);
         manager.createBoundingBox();
         manager.drawBoundingBox();
      }
      manager.selecting = false;
   });

   this.drawBoard.on('mouse:move', function(options) {
      manager.map.OnMouseMove(options.e);
   });

}

//----------------------------------------------------------------------//

/**
 * Set the topLeftPoint and the bottomRightPoint of the new Boundingbox
 */
BoundingBoxManager.prototype.createBoundingBox = function () {

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

   console.log("box from [" + this.topLeftPoint.x + " | " + this.topLeftPoint.y + "] to [" + this.bottomRightPoint.x + " | " + this.bottomRightPoint.y + "]");   
}

//----------------------------------------------------------------------//

/**
 * Draw the new Bounding Box using topLeftPoint and bottomRightPoint
 * Note Rect.top/left offset : origin du repere de fabric est au centre des objets : (pour faciliter les calculs de pivots)
 */
BoundingBoxManager.prototype.drawBoundingBox = function () {

   this.drawBoard.clear();
   var w = this.bottomRightPoint.x - this.topLeftPoint.x;
   var h = this.bottomRightPoint.y - this.topLeftPoint.y;

   var rect = new fabric.Rect({
      width: w,
      height: h,
      top: this.topLeftPoint.y + h/2,
      left: this.topLeftPoint.x + w/2,
      fill: 'rgba(0,0,0,0.1)'
   });


   this.drawBoard.add(rect);
   this.drawBoard.item(0).lockRotation = true;
   this.drawBoard.item(0).hasRotatingPoint = false;
   this.drawBoard.item(0).set({
      borderColor: 'black',
      cornerColor: 'black',
      cornersize: 5
   });

   this.drawBoard.setActiveObject(this.drawBoard.item(0));
}

//----------------------------------------------------------------------//


BoundingBoxManager.prototype.block = function () {
   this.drawBoard.item(0).selectable = false;
}

BoundingBoxManager.prototype.allow = function () {
   this.drawBoard.item(0).selectable = true;
}












