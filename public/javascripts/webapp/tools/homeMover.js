// ----------------------------//

function HomeMover() {
   
}

// ----------------------------//

HomeMover.prototype.move = function() {
   var position = $("#homeImage").css("backgroundPositionX").split("px")[0];
   
   $("#homeImage").css("backgroundPosition", (position-1)+"px");
}
