
var style = null
$.ajax({
   url: '/assets/style/style.jsonz',
   async: false,
   dataType: 'json',
   success: function (data) {
      style = data
   }
});

function LineSymbolizer ( ctx , line , attr , params ) {
   ctx.save()
   if  ( "dasharray" in params ) {
      var daStr = params  ["dasharray"].split(",");
      var da = $.map( daStr , function(n){ return parseInt(n); });
      RenderLineDA(ctx,line,da);
   }
   else {
      RenderLine(ctx,line);   
   }
   if ( "alpha" in params ) {
      ctx.globalAlpha=params["alpha"]
   }
   if ( "width" in params ) {
      ctx.lineWidth = params["width"] ;
   }
   if ( "linejoin" in params ) 
      ctx.lineJoin= params["linejoin"] ;
   if ( "linecap" in params )
      ctx.lineCap = params ["linecap"];
   if ( "stroke" in params ) {
      ctx.strokeStyle= params["stroke"]
      ctx.stroke();
   }
   ctx.restore()
}
function PolygonSymbolizer ( ctx , line , attr , params ) {
   ctx.save()
   RenderLine(ctx,line);   
   if ( "alpha" in params ) 
      ctx.globalAlpha=params["alpha"]
   if ( "fill" in params ) {
      ctx.fillStyle= params["fill"]
      ctx.fill();
   }
   ctx.restore()
}
function LinePatternSymbolizer  ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : LinePatternSymbolizer")
   // ctx.restore()
}
function PolygonPatternSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : PolygonPatternSymbolizer")
   // ctx.restore()
}
function PointSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : PointSymbolizer")
   // ctx.restore()
}
function TextSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : TextSymbolizer")
   // ctx.restore()
}
function RasterSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : RasterSymbolizer")
   // ctx.restore()
}
function ShieldSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : ShieldSymbolizer")
   // ctx.restore()
}
function BuildingSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : BuildingSymbolizer")
   // ctx.restore()
}
function MarkersSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : MarkersSymbolizer")
   // ctx.restore()
}
function GlyphSymbolizer( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : GlyphSymbolizer")
   // ctx.restore()
}

function ApplyStyle ( ctx , line , attr, styleId , zoomLevel , drawIn ) {
   if ( !style [ styleId ].visible )
      return
   if ( style [ styleId ].layer != drawIn)
      return
   for (var s in style [ styleId ]["s"]) {
      if ( zoomLevel >=style[ styleId ]["s"][s].zmax && zoomLevel <= style[ styleId ]["s"][s].zmin ) {
         for (var ss in style [ styleId ]["s"][s].s) {
            if ( style [ styleId ]["s"][s].s[ss].rt in window ) {
               window[ style [ styleId ]["s"][s].s[ss].rt ] ( ctx , line, attr, style [ styleId ]["s"][s].s[ss] )
            }
         }
      }
   }
}

var maxRenderTime = 0
function RenderLayers ( ctx , data , zoomLevel , begin ) {
   var beginAt;
   var limitTime = false;
   if(typeof(begin)==='undefined' || begin == null) {
      beginAt = 0
   }
   else {
      beginAt = begin
      limitTime = true;
   }
   var date    = new Date
   var startT  = date.getTime();

   var i;
   for (i = beginAt ; i < data["l"].length ; ++i ) {
      var layer = data["l"][i];
      var cl = layer["c"];
      var ll = layer["g"];
      var al = null;
      if ("a" in layer) al = layer["a"]
      if (ll == null) 
         continue
      
      for ( var l = 0 ; l < ll.length ; ++l ) {
         var lines = ll[l]
         var attr  = null
         if (al) attr = al[l]
         for ( var li = 0 ; li < lines.length ; ++li ) {
            var line = lines[li]
            ApplyStyle ( ctx , line , attr , cl , zoomLevel,"back")
         }
      }
      if (limitTime) {
         var diffT   = (new Date).getTime() - startT;
         maxRenderTime = Math.max(maxRenderTime,diffT);
         if ( diffT > 10 )
            break;
         
      }
   }
   var diffT   = (new Date).getTime() - startT;
   if ( i < data["l"].length )
      return [ i+1 , diffT ];
   else 
      return [ null , diffT ] ;
}