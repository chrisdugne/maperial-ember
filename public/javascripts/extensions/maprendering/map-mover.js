//==================================================================//

function MapMover(map){
   this.lastMouseX   = null;
   this.lastMouseY   = null;
   this.autoMoving   = false;
   this.mouseData    = [];
   this.drawers      = [];
   this.map          = map;
}

//==================================================================//

MapMover.prototype.reset = function (event) {

   this.autoMoving   = false;
   this.mouseData    = [];
   this.lastMouseX   = event.clientX;
   this.lastMouseY   = event.clientY;

}

//==================================================================//

MapMover.prototype.addDrawer = function (drawer) {
   this.drawers.push(drawer);
}

MapMover.prototype.removeDrawer = function (drawer) {

   for(var i = 0; i < this.drawers.length; i++){
      if(this.drawers[i] === drawer){
         break;
      }
   }

   this.drawers.splice(i,1);
}

//==================================================================//

MapMover.prototype.moveMap = function (dx, dy) {
   var r = this.map.coordS.Resolution ( this.map.zoom );
   this.map.centerM.x -= dx * r;
   this.map.centerM.y += dy * r;   
}

MapMover.prototype.moveDrawers = function (dx, dy) {
   for(var i = 0; i < this.drawers.length; i++){
      var drawer = this.drawers[i]

      for(var j = 0; j < drawer.pointsToMove.length; j++){
         var point = drawer.pointsToMove[j];
         point.x += dx;
         point.y += dy;
      }
      
      drawer.draw();
   }
}

//==================================================================//

MapMover.prototype.drag = function (event) {

   var newX = event.clientX;
   var newY = event.clientY;
   var deltaX = newX - this.lastMouseX;
   var deltaY = newY - this.lastMouseY;
   this.lastMouseX = newX
   this.lastMouseY = newY;

   this.registerMouseData(newX, newY);

   this.moveMap(deltaX, deltaY);
   this.moveDrawers(deltaX, deltaY);  
}

//==================================================================//
//Auto Move workflow

MapMover.prototype.autoMove = function () {

   // on arrive dans des cas chelous qui petent tout parfois..
   if(this.mouseData.length < 3)
      return;

   // recup des derniers moves de la souris
   var startPoint = this.mouseData[0];
   var endPoint = this.mouseData.pop();

   // verif si la souris n'a pas été statique a la fin = no automove
   var now = new Date().getTime();
   if(now - endPoint.time > 120)
      return;

   var startPoint = this.mouseData[0];
   var endPoint = this.mouseData.pop();

   var deltaX = endPoint.x - startPoint.x;
   var deltaY = endPoint.y - startPoint.y;

   var deltaTime = endPoint.time - startPoint.time;
   var distance = Math.sqrt( deltaX*deltaX + deltaY*deltaY );

   var speed = (distance*1000/deltaTime)/MapParameter.refreshRate;

   var speedX = (speed*deltaX/distance)*MapParameter.autoMoveSpeedRate;
   var speedY = (speed*deltaY/distance)*MapParameter.autoMoveSpeedRate;

   this.autoMoving = true;
   this.moveScene(MapParameter.autoMoveMillis, speedX, speedY, 0);
}

MapMover.prototype.moveScene = function (timeRemaining, speedX, speedY, nbAutoMove) {

   if(timeRemaining < 0 || !this.autoMoving)
      return;

   if(isNaN(speedX)){
      return;
   }

   this.moveMap(speedX, speedY);
   this.moveDrawers(speedX, speedY);

   var me = this;
   var rate = 0.99 - nbAutoMove* MapParameter.autoMoveDeceleration;

   setTimeout(function() {me.moveScene(timeRemaining - MapParameter.refreshRate, speedX*rate, speedY*rate, nbAutoMove+1)}, MapParameter.refreshRate );
}


MapMover.prototype.registerMouseData = function (x, y) {

   if(this.mouseData.length >= MapParameter.autoMoveAnalyseSize)
      this.mouseData.shift();

   var data = new Object();
   data.x = x;
   data.y = y;
   data.time = new Date().getTime();

   this.mouseData.push(data);

}




