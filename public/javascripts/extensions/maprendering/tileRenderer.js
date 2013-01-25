
//----------------------------------------------------------------------------------------------//

var DUMMY_LEVEL = "dummyLevel";  // dummyTile pour recup le style sous le click
var BACKGROUND_LEVEL = "back";

//----------------------------------------------------------------------------------------------//

var TileRenderer = {};

//----------------------------------------------------------------------------------------------//

TileRenderer.__style = null; 

TileRenderer.SetStyle = function(style){
   TileRenderer.__style = style;
}

TileRenderer.GetStyle = function(){
   return TileRenderer.__style;
}

//----------------------------------------------------------------------------------------------//
/*
 * layerId + zoom = ruleId = unique
 */

TileRenderer.layerDummyColors = [];
TileRenderer.ApplyStyle = function ( ctx , line , attr, layerId , zoom , level ) {

   try {
      var curLayer = TileRenderer.__style [ layerId ] // on a 1 seul symbolizer par layer

      if ( !curLayer.visible ) return;
      if ( level != DUMMY_LEVEL && curLayer.layer != level) return;

      for (var _s = 0 ; _s < curLayer.s.length ; _s++ ) {
         var curStyle = curLayer.s[_s];

         if ( zoom >= curStyle.zmax && zoom <= curStyle.zmin ) {
            for (var _ss = 0 ; _ss < curStyle.s.length ; _ss++){ 
               var params = curStyle.s[_ss];

               if ( TileRenderer[params.rt] ) 
               { 
                  if(level == DUMMY_LEVEL){

                     if(TileRenderer.layerDummyColors[layerId] == undefined)
                     {
                        var rd1 =  (Math.floor (Math.random()*16)).toString(16);
                        var rd2 =  (Math.floor (Math.random()*16)).toString(16);
                        var rd3 =  (Math.floor (Math.random()*16)).toString(16);
                        var color = "#" + rd1 + layerId[0] + rd2 + layerId[1] + layerId[2] + rd3;

                        console.log("layerId hidden : " + layerId);
                        console.log("colorRandomized : " + color);
                        TileRenderer.layerDummyColors[layerId] = color;
                     }
                     else
                        var color = TileRenderer.layerDummyColors[layerId];

                     var params = jQuery.extend(true, {}, params);
                     params["alpha"] = "1";
                     params["fill"] = color;
                     params["stroke"] = color;
                  }

                  TileRenderer[ params.rt ] ( ctx , line, attr, params )
               }
            }
         }
      }
   }
   catch (e) {
//    console.log ( "ApplyStyle Failed : " + e );
   }
}

/**
 *  data = json qui contient toutes les donnees de la map.
 *  data["l"] = <layers> = toutes les donnees lieees au Layers
 *  			contient une liste de <layerGroup>
 *  <layerGroup> contient une liste de <layer> (ll) et une liste de sources (liee)
 *  <layer> contient une liste de <rule> 
 *  <rule> contient une liste de <style> 
 *  
 * Un layer est
 * une liste de 
 *  g group
 */
TileRenderer.maxRenderTime = 0
TileRenderer.RenderLayers = function ( dummyTile, ctx , data , zoom , begin ) {

   var beginAt;
   var limitTime = false;

   if(typeof(begin)==='undefined' || begin == null) {
      beginAt = 0;
   }
   else {
      beginAt = begin;
      limitTime = true;
   }

   var date    = new Date
   var startT  = date.getTime();

   ctx.scale(1,1);
   var i;

   for (i = beginAt ; i < data["l"].length ; ++i ) {
      var layer = data["l"][i]; // layerGroup
      var cl = layer["c"]; // class - il devrait y avoir une class par Layer, pas par LayerGroup ? 
      var ll = layer["g"]; // liste de listes de lignes
      var al = null; // attributlist
      if ("a" in layer) al = layer["a"]
      if (ll == null) 
         continue

         for ( var l = 0 ; l < ll.length ; ++l ) {
            var lines = ll[l] // liste de lignes
            var attr  = null // attribut
            if (al) attr = al[l] // attributlist
            for ( var li = 0 ; li < lines.length ; ++li ) 
            {
               var line = lines[li]
               var level = BACKGROUND_LEVEL; 

               if(dummyTile)
                  level = DUMMY_LEVEL;

               TileRenderer.ApplyStyle ( ctx , line , attr , cl , zoom, level)
            }
         }
      if (limitTime) {
         var diffT   = (new Date).getTime() - startT;
         TileRenderer.maxRenderTime = Math.max(TileRenderer.maxRenderTime,diffT);
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

//----------------------------------------------------------------------------------------------//
//Symbolizer rendering



TileRenderer.LineSymbolizer = function( ctx , line , attr , params ) {
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

TileRenderer.PolygonSymbolizer = function ( ctx , line , attr , params ) {
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

TileRenderer.LinePatternSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : LinePatternSymbolizer")
   // ctx.restore()
}

TileRenderer.PolygonPatternSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : PolygonPatternSymbolizer")
   // ctx.restore()
}

TileRenderer.PointSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : PointSymbolizer")
   // ctx.restore()
}

TileRenderer.TextSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : TextSymbolizer")
   // ctx.restore()
}

TileRenderer.RasterSymbolizer = function( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : RasterSymbolizer")
   // ctx.restore()
}

TileRenderer.ShieldSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : ShieldSymbolizer")
   // ctx.restore()
}

TileRenderer.BuildingSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : BuildingSymbolizer")
   // ctx.restore()
}

TileRenderer.MarkersSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : MarkersSymbolizer")
   // ctx.restore()
}

TileRenderer.GlyphSymbolizer = function ( ctx , line , attr , params ) {
   // ctx.save()
   // console.log ("Not yet implemented : GlyphSymbolizer")
   // ctx.restore()
}
