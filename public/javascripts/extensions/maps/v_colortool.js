function rgbToHex(R,G,B) {
   return toHex(R)+toHex(G)+toHex(B);
}

function toHex(n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function RGBAToHex(rgbstr){
    var r = rgbstr.split('(')[1].split(',')[0];
    var g = rgbstr.split('(')[1].split(',')[1];
    var b = rgbstr.split('(')[1].split(',')[2];
    return "#"+rgbToHex(r,g,b);
}

function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}
function hexToR(h) { return parseInt((cutHex(h)).substring(0,2),16) }
function hexToG(h) { return parseInt((cutHex(h)).substring(2,4),16) }
function hexToB(h) { return parseInt((cutHex(h)).substring(4,6),16) }

function HexToRGBA(hexstr){
   var r = hexToR(hexstr);
   var g = hexToG(hexstr);
   var b = hexToB(hexstr);
   var a = 1.0;
   return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}


