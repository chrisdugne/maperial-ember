
//=====================================================================================//

function MapRenderer(maperial) {

   console.log("  building map renderer...");
   
   this.drawSceneInterval;
   
   this.maperial = maperial;
   this.config = maperial.config;
   this.context = maperial.context;
   
   this.tileCache = {};
   this.dataCache = {};
   
   this.initListeners();
}

//----------------------------------------------------------------------//

MapRenderer.prototype.reset = function () {
   this.removeListeners();

   // unload every tile
   for (var key in this.tileCache) {
      this.tileCache[key].Release();
      this.tileCache[key].Reset();
      delete this.tileCache[key];
   }
   
   this.tileCache = {};
   this.dataCache = {};
   
   this.DrawScene(true, true);
}
   
//----------------------------------------------------------------------//
   
   MapRenderer.prototype.initListeners = function () {

   var renderer = this;
   
   if(this.config.hud.elements[HUD.MAGNIFIER] && this.config.hud.elements[HUD.MAGNIFIER].show){
      this.context.mapCanvas.on(MaperialEvents.MOUSE_MOVE, function(){
         renderer.DrawMagnifier();
      });
   }
   
   $(window).on(MaperialEvents.MOUSE_UP_WIHTOUT_AUTOMOVE, function(){
      if(renderer.config.map.edition){
         renderer.FindLayerId();
      }
   });

   $(window).on(MaperialEvents.STYLE_CHANGED, function(){
      renderer.DrawScene (true,true);
   });
   
   $(window).on(MaperialEvents.COLORBAR_CHANGED, function(){
      renderer.BuildColorBar();
   });
   
   $(window).on(MaperialEvents.CONTRAST_CHANGED, function(){
      //
   });
   
   $(window).on(MaperialEvents.LUMINOSITY_CHANGED, function(){
      //
   });
   
   $(window).on(MaperialEvents.BW_METHOD_CHANGED, function(){
      //
   });
   
   $(window).on(MaperialEvents.DATA_SOURCE_CHANGED, function(){
      //Reload ALL ???? and Redraw ??
      //renderer.DrawScene (true) 
   });
}

//----------------------------------------------------------------------//

MapRenderer.prototype.removeListeners = function () {

   this.context.mapCanvas.off(MaperialEvents.MOUSE_MOVE);
   $(window).off(MaperialEvents.MOUSE_UP_WIHTOUT_AUTOMOVE);
   $(window).off(MaperialEvents.STYLE_CHANGED);
   $(window).off(MaperialEvents.COLORBAR_CHANGED);
   $(window).off(MaperialEvents.CONTRAST_CHANGED);
   $(window).off(MaperialEvents.LUMINOSITY_CHANGED);
   $(window).off(MaperialEvents.BW_METHOD_CHANGED);
   $(window).off(MaperialEvents.DATA_SOURCE_CHANGED);
   
   clearInterval(this.drawSceneInterval);
}

//----------------------------------------------------------------------//

MapRenderer.prototype.fitToSize = function () {
   if(this.gl){
      this.gl.viewportWidth  = this.context.mapCanvas.width();
      this.gl.viewportHeight = this.context.mapCanvas.height();
   }
}

//----------------------------------------------------------------------//

MapRenderer.prototype.InitGL = function () {

   this.glAsset                           = new Object();
   this.glAsset.ctx                       = this.gl;
   this.context.parameters.assets         = this.glAsset;
   this.glAsset.shaderData                = null;
   this.glAsset.shaderError               = false;
   var me                                 = this.glAsset;
   
   this.glAsset.ShaderReq  = $.ajax({
      type     : "GET",
      url      : MapParameters.shadersPath + "/all.json",
      dataType : "json",
      async    : false,
      success  : function(data, textStatus, jqXHR) {
         me.shaderData = data;
         for (k in me.shaderData) {
            me.shaderData[k].code = me.shaderData[k].code.replace (/---/g,"\n") 
         }
      },
      error : function(jqXHR, textStatus, errorThrown) {
         me.shaderError = true
         console.log ( MapParameters.shadersPath + "/all.json" + " : loading failed : " + textStatus );
      }
   });

   var vertices                                       = [ 0.0  , 0.0  , 0.0,     256.0, 0.0  , 0.0,      0.0  , 256.0, 0.0,      256.0, 256.0, 0.0 ];
   this.glAsset.squareVertexPositionBuffer            = this.gl.createBuffer();
   this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.glAsset.squareVertexPositionBuffer );
   this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW );
   this.glAsset.squareVertexPositionBuffer.itemSize   = 3;
   this.glAsset.squareVertexPositionBuffer.numItems   = 4;
   
   var textureCoords                                  = [ 0.0, 0.0,     1.0, 0.0,      0.0, 1.0,      1.0, 1.0 ]; // Y swap
   this.glAsset.squareVertexTextureBuffer             = this.gl.createBuffer();
   this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.glAsset.squareVertexTextureBuffer );
   this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW );
   this.glAsset.squareVertexTextureBuffer.itemSize    = 2;
   this.glAsset.squareVertexTextureBuffer.numItems    = 4;

   this.gl.clearColor   ( 1.0, 1.0, 1.0, 1.0  );
   this.gl.disable      ( this.gl.DEPTH_TEST  );

   this.glAsset.prog = {}
   
   this.glAsset.prog["Tex"]                     = this.gltools.MakeProgram   ( "vertexTex" , "fragmentTex"         , this.glAsset); 
   this.glAsset.prog["Clut"]                    = this.gltools.MakeProgram   ( "vertexTex" , "fragmentClut"        , this.glAsset);
   this.glAsset.prog[MapParameters.MulBlend]     = this.gltools.MakeProgram   ( "vertexTex" , "fragmentMulBlend"    , this.glAsset);
   this.glAsset.prog[MapParameters.AlphaClip]    = this.gltools.MakeProgram   ( "vertexTex" , "fragmentAlphaClip"   , this.glAsset);
   this.glAsset.prog[MapParameters.AlphaBlend]   = this.gltools.MakeProgram   ( "vertexTex" , "fragmentAlphaBlend"  , this.glAsset);
   
   // Check good init !
   // ....
}

MapRenderer.prototype.BuildColorBar = function () {
   cbs = this.context.parameters.GetColorBars ();
   
   this.gl.flush ()
   this.gl.finish()
      
   for ( k in cbs ) {
      cbData = cbs[ k ].data;
      if ( cbData == null || cbData.length != 256 * 4)  {
         console.log ( "Invalid colorbar data : " + k )
         break;
      }
      if ( cbs[ k ].tex ) {
         this.gl.deleteTexture ( cbs[ k ].tex )
         delete cbs[ k ].tex // good ??
         cbs[ k ].tex = null;
      }
    
      try {
         cbs[ k ].tex = this.gl.createTexture();
         this.gl.bindTexture  (this.gl.TEXTURE_2D, cbs[ k ].tex );
         this.gl.pixelStorei  (this.gl.UNPACK_FLIP_Y_WEBGL  , false    );
         this.gl.texImage2D   (this.gl.TEXTURE_2D, 0 , this.gl.RGBA, 256 , 1 , 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, cbData );
         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
         this.gl.bindTexture  (this.gl.TEXTURE_2D, null );
      } catch (e) { 
         this.gl.deleteTexture ( cbs[ k ].tex );
         delete cbs[ k ].tex;
         cbs[ k ].tex = null;
         console.log ( "Error in colorbar building : " + k );
      }
   }
   return true;
}

MapRenderer.prototype.Start = function () {

   console.log("  starting rendering...");
   
   try {
      this.gl = this.context.mapCanvas[0].getContext("experimental-webgl");
      this.fitToSize();
   } catch (e) { }
   if (!this.gl) {
      console.log("Could not initialise WebGL")
      return false;
   }
   
   this.gltools = new GLTools ()
   this.InitGL()

   if ( !this.BuildColorBar() ) {
      console.log("Can't build colorbar")
      return false;
   }
   
   this.DrawScene();
   this.drawSceneInterval = setInterval( Utils.apply ( this, "DrawScene" ) , MapParameters.refreshRate + 5 );
   return true;
} 

//----------------------------------------------------------------------//

MapRenderer.prototype.UpdateTileCache = function (zoom, txB , txE , tyB , tyE, forceTileRedraw) {
   var keyList = [];

   for ( tx = txB ; tx <= txE ; tx = tx + 1) {
      for ( ty = tyB ; ty <= tyE ; ty = ty + 1) {
         var key = tx + "," + ty + "," + zoom;
         keyList.push(key) 
         if ( this.tileCache[key] == null ) {
            this.tileCache[key]  = new Tile ( this.context, this.config, tx, ty, zoom);
         }
      }
   }

   // unload unnecessary loaded tile
   for (var key in this.tileCache) {
      var isInKeyList = false
      for (var ki = 0 ; ki < keyList.length ; ki++) {
         if (keyList[ki] === key) isInKeyList = true
      }
      if ( ! isInKeyList ) {
         this.tileCache[key].Release();
         delete this.tileCache[key];
      }
   }

   if ( forceTileRedraw ) {
      for (var key in this.tileCache) {
         var tile = this.tileCache[key].Reset ( );
      }
   }

   var tileModified = false;
   var timeRemaining = MapParameters.refreshRate;
   
   for (var ki = 0 ; ki < keyList.length ; ki++) {      
      var tile = this.tileCache[keyList[ki]];
      if (tile && !tile.IsUpToDate () )  {
         tileModified = true
         timeRemaining = tile.Update( timeRemaining )
         if ( timeRemaining <= 0 )
            break;
      }
   }
   
   return tileModified
}

//----------------------------------------------------------------------//

MapRenderer.prototype.DrawScene = function (forceGlobalRedraw,forceTileRedraw) {

   if(typeof(forceGlobalRedraw)==='undefined' )
      forceGlobalRedraw = true;
   if(typeof(forceTileRedraw)==='undefined' )
      forceTileRedraw = false;

   var w = this.context.mapCanvas.width();
   var h = this.context.mapCanvas.height();

   var w2 = Math.floor ( w / 2 );
   var h2 = Math.floor ( h / 2 );

   var r       = this.context.coordS.Resolution ( this.context.zoom );
   var originM = new Point( this.context.centerM.x - w2 * r , this.context.centerM.y + h2 * r );
   var tileC   = this.context.coordS.MetersToTile ( originM.x, originM.y , this.context.zoom );

   var originP = this.context.coordS.MetersToPixels ( originM.x, originM.y, this.context.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameters.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameters.tileSize - originP.y ) ) );

   var nbTileX = Math.floor ( w  / MapParameters.tileSize +1 );
   var nbTileY = Math.floor ( h  / MapParameters.tileSize  +1 ) ; 
   
   if ( this.UpdateTileCache ( this.context.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y , forceTileRedraw ) || forceGlobalRedraw) {

      mvMatrix      = mat4.create();
      pMatrix       = mat4.create();
      mat4.identity    ( pMatrix );
      mat4.ortho       ( 0, w , h, 0 , 0, 1, pMatrix ); // Y swap !
      this.gl.viewport ( 0, 0, w , h);
      this.gl.clear    ( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
      for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameters.tileSize , tx = tx + 1) {
         for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+ MapParameters.tileSize , ty = ty - 1) {
            mat4.identity (mvMatrix);
            mat4.translate(mvMatrix, [wx, wy , 0]);
            var key  = tx + "," + ty + "," + this.context.zoom;
            var tile = this.tileCache[key]
            tile.Render (pMatrix, mvMatrix);
         }
      }
   }
}

//----------------------------------------------------------------------//

/**
 * FindLayerId is still part of MapRenderer since there actually is a rendering here ! 
 */
MapRenderer.prototype.FindLayerId = function () {

   // retrieve the tile clicked
   var tileCoord = this.context.coordS.MetersToTile ( this.context.mouseM.x, this.context.mouseM.y , this.context.zoom );
   var key = tileCoord.x + "," + tileCoord.y + "," + this.context.zoom;

   var tile = this.tileCache[key];

   if(!tile || !tile.IsLoaded())
      return;

   // find the click coordinates inside invisibleCanvas
   // http://map.x-ray.fr/wiki/pages/viewpage.action?pageId=2097159 [3rd graph]
   var clickP = this.context.coordS.MetersToPixels ( this.context.mouseM.x, this.context.mouseM.y, this.context.zoom );
   var tileClickCoord = new Point(Math.floor (clickP.x - tileCoord.x*MapParameters.tileSize), Math.floor ( (tileCoord.y+1) * MapParameters.tileSize - clickP.y ) );
   
   var style = this.maperial.stylesManager.getSelectedStyle();
   var subLayerId = tile.FindSubLayerId( tileClickCoord , this.context.zoom, style.content ) ;

   console.log("subLayerId :  " + subLayerId);
   $(window).trigger(MaperialEvents.OPEN_STYLE, [subLayerId]);
}

//----------------------------------------------------------------------//

MapRenderer.prototype.DrawMagnifier = function () {

   var scale = 3;
   var w = this.context.magnifierCanvas.width();
   var h = this.context.magnifierCanvas.height();
   var left = (w/2)/scale;
   var top = (h/2)/scale;
   var r = this.context.coordS.Resolution ( this.context.zoom );
   
   var originM = new Point( this.context.mouseM.x - left * r , this.context.mouseM.y + top * r );
   var tileC   = this.context.coordS.MetersToTile ( originM.x, originM.y , this.context.zoom );

   var originP = this.context.coordS.MetersToPixels ( originM.x, originM.y, this.context.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameters.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameters.tileSize - originP.y ) ) );

   var ctxMagnifier = this.context.magnifierCanvas[0].getContext("2d");
   ctxMagnifier.save();
   ctxMagnifier.globalCompositeOperation="source-over";
   ctxMagnifier.scale(scale, scale);

   // wx/wy (pixels) in canvas mark ( coord ) !!
   for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameters.tileSize , tx = tx + 1) {
      for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+MapParameters.tileSize , ty = ty - 1) {
         var key  = tx + "," + ty + "," + this.context.zoom;
         var tile = this.tileCache[key] 
         TileRenderer.DrawImages(tile, ctxMagnifier, wx, wy);
      }
   }    

   ctxMagnifier.restore();

   this.DrawMagnifierSight(ctxMagnifier);
}

//----------------------------------------------------------------------//

//viseur counterStrike pour le zoom yeah
MapRenderer.prototype.DrawMagnifierSight = function (ctxMagnifier) {

   var w = this.context.magnifierCanvas.width();
   var h = this.context.magnifierCanvas.height();

   ctxMagnifier.beginPath();
   ctxMagnifier.moveTo(w/2-20, h/2);
   ctxMagnifier.lineTo(w/2-4, h/2);      
   ctxMagnifier.closePath();
   ctxMagnifier.stroke();      

   ctxMagnifier.beginPath();
   ctxMagnifier.moveTo(w/2+4, h/2);
   ctxMagnifier.lineTo(w/2+20, h/2);      
   ctxMagnifier.closePath();
   ctxMagnifier.stroke();      

   ctxMagnifier.beginPath();
   ctxMagnifier.moveTo(w/2, h/2-20);
   ctxMagnifier.lineTo(w/2, h/2-4);      
   ctxMagnifier.closePath();
   ctxMagnifier.stroke();      

   ctxMagnifier.beginPath();
   ctxMagnifier.moveTo(w/2, h/2+4);
   ctxMagnifier.lineTo(w/2, h/2+20);      
   ctxMagnifier.closePath();
   ctxMagnifier.stroke();      
}
