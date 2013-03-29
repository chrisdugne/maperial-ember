
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