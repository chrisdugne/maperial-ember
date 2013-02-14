// ----------------------------//

function HomeScroller() {
   
}

var nbParts = 5;
var lastHomeBackTop = 0;

// ----------------------------//

HomeScroller.prototype.scroll = function(event, delta) {

//   var footerTop = $("#footer").offset().top;
//   var footerBottom = footerTop + $("#footer").height();
//
//   var pageTop = $(window).scrollTop();
//   var pageBottom = pageTop + $(window).height();
//   
//   console.log("$(window).height() : " + $(window).height());
//   console.log("----------");
//   
//   for(var i=2; i <= nbParts; i++){
//      console.log("--- " + i);
//      var partInitialTop = $("#part"+i).offset().top;
//      var partTop = partInitialTop - pageTop;
//      var partBottom = partTop + $("#part"+i).height();
//
//      if(partBottom < $(window).height()){
//         var newMargin = "-300px";
//      }
//      else{
//         var newMargin = "0px";
//      }
//
//      $("#imageBack"+i).css({
//         marginTop: newMargin,
//      });
//   }
//   console.log(event.originalEvent.srcElement.id);
//   console.log(event);
//   console.log(event.originalEvent.srcElement);
//   console.log(event.originalEvent.srcElement.id);
   
   var pageTop = $(window).scrollTop();
   var customDelta = pageTop/5;
   
   
   /*
    * 
    * <img src="kate.png" style="-webkit-border-radius: 10px; -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))">
    * 
    */
   
   for(var i=1; i <= nbParts; i++){
      
      if(i>1)
      {
         var partBottom = $('#part'+i).offset().top - pageTop + $('#part'+i).height();
         if(partBottom <= $(window).height())
            customDelta += $('#part'+i).height() + 180;
         else
            customDelta -= $('#part'+i).height() + 180;
      }
      
      var dy = -customDelta + "px";
      $('#imageBack'+i).css('-webkit-transform', 'translate3d(0, '+ dy +' ,0)');
      $('#imageBack'+i).css('zIndex', -i);
   }
   
   $('#header').css('-webkit-transform', 'translate3d(0, 0 ,0)'); // sans quoi il ne reste pas fixe..?
}
