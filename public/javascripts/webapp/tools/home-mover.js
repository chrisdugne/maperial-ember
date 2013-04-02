// ----------------------------//

function HomeMover() {}

// ----------------------------//

HomeMover.prototype.move = function() {
   try{
      var position = document.getElementById('homeImage').style.backgroundPositionX.split("px")[0];
      document.getElementById('homeImage').style.backgroundPositionX = (position-1)+"px";
   }
   catch(e){}
}

// ----------------------------//

window.homeMover = new HomeMover();
setInterval( window.homeMover.move , 40 );