
//=====================================================================================//

function MapRenderer(config) {
   
   console.log("building a new mapRenderer");

   this.config             = config,
   this.tileCache          = {};
   this.dataCache          = {};
   
   this.initListeners();
   this.Start(); 
}

//----------------------------------------------------------------------//

MapRenderer.prototype.initListeners = function () {

   this.config.mapCanvas.on(MapEvents.OnMouseDown, function(event, x, y){
      this.DrawMagnifier();
   });
   
}


//----------------------------------------------------------------------//
MapRenderer.prototype.resize = function () {
   
   console.log("resize : " + this.config.map.width + " | " + this.config.map.height);
   
   this.config.mapCanvas.css("width", this.config.map.width );
   this.config.mapCanvas.css("height", this.config.map.height );
}

//----------------------------------------------------------------------//

MapRenderer.prototype.SetCenter=function(lat,lon){
   this.config.map.centerM = this.config.coordS.LatLonToMeters( lat , lon );
   this.DrawScene();
}

MapRenderer.prototype.SetZoom = function(z){
   if ( z > -1 && z < 19 ){
      this.config.map.zoom = z;
   }
}

MapRenderer.prototype.GetZoom = function(){
   return this.config.map.zoom;
}

MapRenderer.prototype.ZoomIn = function(){
   if ( this.config.map.zoom < 18 ){
      this.SetZoom(this.config.map.zoom + 1 );
   }
}

MapRenderer.prototype.ZoomOut = function(){
   if ( this.config.map.zoom > 0 ){
      this.SetZoom(this.config.map.zoom - 1 );
   }
}

//----------------------------------------------------------------------//

MapRenderer.prototype.OnParamsChange = function (event) {
   if (event == MapParameters.StyleChanged) {
      this.DrawScene (true,true)
   }
   else if (event == MapParameters.ColorBarChanged) {
      //
      this.BuildColorBar();
   }
   else if (event == MapParameters.ContrastChanged) {
      //
   }
   else if (event == MapParameters.LuminosityChanged) {
      //
   }
   else if (event == MapParameters.BWMethodChanged) {
      //
   }
   else if (event == MapParameters.dataSrcChanged) {
      //Reload ALL ???? and Redraw ??
      //this.DrawScene (true)
   }

}

//----------------------------------------------------------------------//

MapRenderer.prototype.InitGL = function () {

   this.glAsset                           = new Object();
   this.glAsset.ctx                       = this.gl;
   this.config.renderParameters.assets    = this.glAsset;
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
   cbs = this.config.renderParameters.GetColorBars ();
   
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
         console.log ( "Error in colorbar building : " + k )
      }
   }
   return true;
}

MapRenderer.prototype.Start = function () {
   try {
      this.gl = this.config.mapCanvas[0].getContext("experimental-webgl");
      this.gl.viewportWidth = canvas.width;
      this.gl.viewportHeight = canvas.height;
   } catch (e) { }
   if (!this.gl) {
      console.log("Could not initialise WebGL")
      return false;
   }

   this.gltools = new GLTools ()
   this.InitGL()

   if ( !this.BuildColorBar() ) {
      console.log("Can't build colorbar")
      return false
   }

   $(window).resize(Utils.bindObjFuncEvent ( this , "OnResize" ) );
   
   this.config.renderParameters.OnChange ( Utils.bindObjFuncEvent ( this, "OnParamsChange" ) );
   this.DrawScene();
   setInterval( Utils.bindObjFunc ( this, "DrawScene" ) , MapParameters.refreshRate + 5 );
   return true
} 

//----------------------------------------------------------------------//

MapRenderer.prototype.UpdateTileCache = function (zoom, txB , txE , tyB , tyE, forceTileRedraw) {
   var keyList = [];

   for ( tx = txB ; tx <= txE ; tx = tx + 1) {
      for ( ty = tyB ; ty <= tyE ; ty = ty + 1) {
         var key = tx + "," + ty + "," + zoom;
         keyList.push(key) 
         if ( this.tileCache[key] == null ) {
            var vurl             = this.config.renderParameters.GetMapURL    ( tx, ty, zoom );
            var rurl             = this.config.renderParameters.GetRasterURL ( tx, ty, zoom );
            this.tileCache[key]  = new Tile ( this.config.renderParameters , zoom);
            this.tileCache[key].Init ( vurl , rurl );
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

   var hasSomeChange = false;
   var timeRemaining = MapParameters.refreshRate;
   for (var ki = 0 ; ki < keyList.length ; ki++) {      
      var tile = this.tileCache[keyList[ki]];
      if (tile && !tile.IsUpToDate () )  {
         hasSomeChange        = true
         timeRemaining        = tile.Update( timeRemaining )
         if ( timeRemaining <= 0 )
            break;
      }
   }
   return hasSomeChange
}

//----------------------------------------------------------------------//

MapRenderer.prototype.DrawScene = function (forceGlobalRedraw,forceTileRedraw) {

   if(typeof(forceGlobalRedraw)==='undefined' )
      forceGlobalRedraw = true;
   if(typeof(forceTileRedraw)==='undefined' )
      forceTileRedraw = false;

   var w = this.config.map.width;
   var h = this.config.map.height;

   if (w != this.gl.viewportWidth || h != this.gl.viewportHeight) {
      console.log("reset gl viewport " + w + " | " + h);
      this.gl.viewportWidth  = w;
      this.gl.viewportHeight = h;
   }

   var w2 = Math.floor ( w / 2 );
   var h2 = Math.floor ( h / 2 );

   var r       = this.config.coordS.Resolution ( this.config.map.zoom );
   var originM = new Point( this.config.map.centerM.x - w2 * r , this.config.map.centerM.y + h2 * r );
   var tileC   = this.config.coordS.MetersToTile ( originM.x, originM.y , this.config.map.zoom );

   var originP = this.config.coordS.MetersToPixels ( originM.x, originM.y, this.config.map.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameters.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameters.tileSize - originP.y ) ) );

   var nbTileX = Math.floor ( w  / MapParameters.tileSize +1 );
   var nbTileY = Math.floor ( h  / MapParameters.tileSize  +1 ) ; 
   
   if ( this.UpdateTileCache ( this.config.map.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y , forceTileRedraw ) || forceGlobalRedraw) {
      mvMatrix      = mat4.create();
      pMatrix       = mat4.create();
      mat4.identity    ( pMatrix );
      mat4.ortho       ( 0, w , h, 0 , 0, 1, pMatrix ); // Y swap !
      this.gl.viewport ( 0, 0, w , h);
      this.gl.clear    ( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
      var layerDataParams = [this.config.renderParameters.GetContrast(),this.config.renderParameters.GetLuminosity(),this.config.renderParameters.GetBWMethod()]
      for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameters.tileSize , tx = tx + 1) {
         for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+ MapParameters.tileSize , ty = ty - 1) {
            mat4.identity (mvMatrix);
            mat4.translate(mvMatrix, [wx, wy , 0]);
            var key  = tx + "," + ty + "," + this.config.map.zoom;
            var tile = this.tileCache[key]
            tile.Render (pMatrix, mvMatrix);
         }
      }
   }
}

//----------------------------------------------------------------------//

MapRenderer.prototype.DrawMagnifier = function () {
   if (! this.magnifierCanvas )
      return;

   var scale = 3;
   var w = this.magnifierCanvas.width;
   var h = this.magnifierCanvas.height;
   var left = (w/2)/scale;
   var top = (h/2)/scale;
   var r = this.config.coordS.Resolution ( this.config.map.zoom );

   var originM = new Point( this.mouseM.x - left * r , this.mouseM.y + top * r );
   var tileC   = this.config.coordS.MetersToTile ( originM.x, originM.y , this.config.map.zoom );

   var originP = this.config.coordS.MetersToPixels ( originM.x, originM.y, this.config.map.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameters.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameters.tileSize - originP.y ) ) );

   var ctxMagnifier = this.magnifierCanvas.getContext("2d");
   ctxMagnifier.save();
   ctxMagnifier.globalCompositeOperation="source-over";
   ctxMagnifier.scale(scale, scale);

   // wx/wy (pixels) in canvas mark ( coord ) !!
   for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameters.tileSize , tx = tx + 1) {
      for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+MapParameters.tileSize , ty = ty - 1) {
         var key  = tx + "," + ty + "," + this.config.map.zoom;
         var tile = this.tileCache[key] 
         TileRenderer.DrawImages(tile, ctxMagnifier, wx, wy);
      }
   }    

   ctxMagnifier.restore();

   this.DrawMagnifierSight(ctxMagnifier);
}

//----------------------------------------------------------------------//

MapRenderer.prototype.OpenStyle = function (event) {

   // retrieve the tile clicked
   var tileCoord = this.config.coordS.MetersToTile ( this.mouseM.x, this.mouseM.y , this.config.map.zoom );
   var key = tileCoord.x + "," + tileCoord.y + "," + this.config.map.zoom;

   var tile = this.tileCache[key];

   if(!tile.IsLoad())
      return;

   // find the click coordinates inside invisibleCanvas
   // http://map.x-ray.fr/wiki/pages/viewpage.action?pageId=2097159 [3rd graph]
   var clickP = this.config.coordS.MetersToPixels ( this.mouseM.x, this.mouseM.y, this.config.map.zoom );
   var tileClickCoord = new Point(Math.floor (clickP.x - tileCoord.x*MapParameters.tileSize), Math.floor ( (tileCoord.y+1) * MapParameters.tileSize - clickP.y ) );

   var layerId = tile.LayerLookup( tileClickCoord , this.config.map.zoom, this.config.renderParameters.GetStyle() ) ;

   StyleMenu.OpenStyle(layerId);
}

//----------------------------------------------------------------------//

//viseur counterStrike pour le zoom yeah
MapRenderer.prototype.DrawMagnifierSight = function (ctxMagnifier) {

   var w = this.magnifierCanvas.width;
   var h = this.magnifierCanvas.height;

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
