//=====================================================================================//
//uniquement cote wwwClient

if(typeof(Utils)==='undefined' || Utils == null) Utils={}

//=====================================================================================//
//a mettre dans webapp/utils.js

Utils.bindObjFunc = function (toObject, methodName){
   return function(){toObject[methodName]()}
}

Utils.bindObjFuncEvent = function (toObject, methodName){
   return function(mEvent){toObject[methodName](mEvent)}
}

Utils.bindObjFuncEvent2 = function (toObject, methodName){
   return function(mEvent,mDelta){toObject[methodName](mEvent,mDelta)}
}

//=====================================================================================//

function GLMap(mapName, magnifierName) {

   this.magnifierCanvas    = $("#"+magnifierName)[0];
   this.magnifierElement   = $("#"+magnifierName);
   this.mapCanvas          = $("#"+mapName)[0];
   this.mapElement         = $("#"+mapName);
   this.mouseDown          = false;
   this.lastMouseX         = null;
   this.lastMouseY         = null;
   this.coordS             = new CoordinateSystem ( MapParameter.tileSize );
   this.centerM            = this.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.mouseM             = this.centerM;
   this.zoom               = 14;
   this.tileCache          = {};
   this.dataCache          = {};
   this.params             = new MapParameter(); 
}


//----------------------------------------------------------------------//
   
GLMap.prototype.GetParams = function (  ) {
   return this.params;
}

//----------------------------------------------------------------------//

GLMap.prototype.OnMouseDown = function (event) {
   this.mouseDown    = true;
   this.lastMouseX   = event.clientX;
   this.lastMouseY   = event.clientY;
   
   if(this.params.GetEditMode() )
      this.EditStyle(event);
}

GLMap.prototype.OnMouseUp = function (event) {
   this.mouseDown = false; 
}

GLMap.prototype.OnMouseMove = function (event) {

   // refresh magnifier
   var mouseP = this.getPoint(event);
   this.mouseM = this.convertPointToMeters ( mouseP );
   //this.DrawMagnifier ( true );
   
   if (!this.mouseDown){
      return;
   }
   
   // dragging
   var newX = event.clientX;
   var newY = event.clientY;
   var deltaX = newX - this.lastMouseX;
   var deltaY = newY - this.lastMouseY;         
   this.lastMouseX = newX
   this.lastMouseY = newY;

   var r            = this.coordS.Resolution ( this.zoom );
   this.centerM.x   = this.centerM.x - deltaX * r;
   this.centerM.y   = this.centerM.y + deltaY * r;       
   

   this.DrawScene ( true );
}

GLMap.prototype.OnMouseWheel = function (event, delta) {
   var w2,h2;
   var r;
   var deltaM
   var cursorM;
   var w        = this.mapElement.width ();
   var h        = this.mapElement.height();
   var mouseX    = event.clientX;
   var mouseY    = h - event.clientY ;
   if (delta != 0) {
      w2       = Math.floor ( w / 2 );
      h2       = Math.floor ( h / 2 );
      r        = this.coordS.Resolution ( this.zoom );
      deltaM   = new Point( ( mouseX - w2 ) * r , ( mouseY - h2 ) * r )
      cursorM  = new Point( this.centerM.x + deltaM.x , this.centerM.y + deltaM.y );
   }
   if (delta > 0) {
      if ( this.zoom < 18 ) {
         this.zoom = this.zoom + 1 ;                                        
      }
   }
   else if (delta < 0) {
      if ( this.zoom > 0 ) {
         this.zoom = this.zoom - 1 ;            
      }
   }
   if (delta != 0) {
      r         = this.coordS.Resolution ( this.zoom );
      deltaM    = new Point( ( mouseX - w2 ) * r , ( mouseY - h2 ) * r );
      this.centerM.x = cursorM.x - deltaM.x;
      this.centerM.y = cursorM.y - deltaM.y;

      console.log("wheel");
      this.DrawScene ( true );     
   } 
}

//----------------------------------------------------------------------//

GLMap.prototype.SetZoom = function(z){
   if ( z > -1 && z < 19 ){
      this.zoom = z;

      console.log("setzoom");
      this.DrawScene ( true );
   }
}

GLMap.prototype.GetZoom = function(){
   return this.zoom;
}

GLMap.prototype.ZoomIn = function(){
   if ( this.zoom < 18 ){
      this.SetZoom(this.zoom + 1 );
   }
}

GLMap.prototype.ZoomOut = function(){
   if ( this.zoom > 0 ){
      this.SetZoom(this.zoom - 1 );
   }
}

//----------------------------------------------------------------------//

GLMap.prototype.OnResize = function (event) {
   this.w                  = this.mapElement.width ();
   this.h                  = this.mapElement.height();
   this.mapCanvas.width    = this.w;
   this.mapCanvas.height   = this.h;
   this.DrawScene ( true );
}

GLMap.prototype.OnParamsChange = function (event) {
   if (event == MapParameter.StyleChanged) {
      this.DrawScene (true,true)
   }
   else if (event == MapParameter.ColorBarChanged) {
      this.BuildColorBar();
      this.DrawScene (true)
   }
   else if (event == MapParameter.ContrastChanged) {
      this.DrawScene (true)
   }
   else if (event == MapParameter.LuminosityChanged) {
      this.DrawScene (true)
   }
   else if (event == MapParameter.BWMethodChanged) {
      this.DrawScene (true)
   }
}

//----------------------------------------------------------------------//

GLMap.prototype.InitGL = function () {
   
   this.glAsset = new Object();
   
   var vertices                                       = [ 0.0, 0.0, 0.0, 256.0, 0.0, 0.0, 0.0, 256.0, 0.0, 256.0, 256.0, 0.0 ];
   this.glAsset.squareVertexPositionBuffer            = this.gl.createBuffer();
   this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.glAsset.squareVertexPositionBuffer );
   this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW );
   this.glAsset.squareVertexPositionBuffer.itemSize   = 3;
   this.glAsset.squareVertexPositionBuffer.numItems   = 4;

   var textureCoords                                  = [ 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0 ]; // Y swap
   this.glAsset.squareVertexTextureBuffer             = this.gl.createBuffer();
   this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.glAsset.squareVertexTextureBuffer );
   this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW );
   this.glAsset.squareVertexTextureBuffer.itemSize    = 2;
   this.glAsset.squareVertexTextureBuffer.numItems    = 4;
   
   this.gl.clearColor   ( 1.0, 1.0, 1.0, 1.0  );
   this.gl.disable      ( this.gl.DEPTH_TEST  );

   this.glAsset.shaderProgramTex  = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertexTex.json" , "assets/shader/fragmentTex.json"  , null); 
   this.glAsset.shaderProgramWTex = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertex.json"    , "assets/shader/fragment.json"     , null);
   this.glAsset.shaderProgramData = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertexTex.json" , "assets/shader/fragmentData.json" , null);
}

GLMap.prototype.BuildColorBar = function () {
   cbData = this.params.GetColorBar ();
   if (cbData == null) 
      return false;
   if ( cbData.length != 256 * 4 )
      return false;
   
   if ( "colorB" in this.glAsset && this.glAsset.colorB != null){
      this.gl.flush ()
      this.gl.finish()
      this.gl.deleteTexture ( this.glAsset.colorB )
      delete this.glAsset.colorB
   }
   try {
      this.glAsset.colorB = this.gl.createTexture();
      this.gl.bindTexture  (this.gl.TEXTURE_2D, this.glAsset.colorB );
      this.gl.texImage2D   (this.gl.TEXTURE_2D, 0 , this.gl.RGBA, 256 , 1 , 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, cbData );
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
                            
      this.gl.bindTexture  (this.gl.TEXTURE_2D, null );
   } catch (e) { 
      this.gl.deleteTexture ( this.glAsset.colorB );
      delete this.glAsset.colorB;
      this.glAsset.colorB = null;
      return false;
   }
   return true;
}

GLMap.prototype.Start = function () {
   try {
      this.gl = this.mapCanvas.getContext("experimental-webgl");
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
   this.mapElement.resize( 
         Utils.bindObjFuncEvent ( this , "OnResize" ) 
   ).mousedown( 
         Utils.bindObjFuncEvent ( this , "OnMouseDown" ) 
   ).mouseup (
         Utils.bindObjFuncEvent ( this , "OnMouseUp" ) 
   ).mousemove (
         Utils.bindObjFuncEvent ( this , "OnMouseMove" )
   ).mouseleave (
         Utils.bindObjFuncEvent ( this , "OnMouseUp" ) 
   ).bind('mousewheel', Utils.bindObjFuncEvent2 ( this , "OnMouseWheel") );

   this.params.OnChange ( Utils.bindObjFuncEvent ( this, "OnParamsChange" ) );
   this.DrawScene();
   setInterval( Utils.bindObjFunc ( this, "DrawScene" ) , MapParameter.refreshRate + 5 );
   return true
} 

//----------------------------------------------------------------------//

GLMap.prototype.UpdateTileCache = function (zoom, txB , txE , tyB , tyE, forceTileRedraw) {
   var keyList = [];
   
   for ( tx = txB ; tx <= txE ; tx = tx + 1) {
      for ( ty = tyB ; ty <= tyE ; ty = ty + 1) {
         var key = tx + "," + ty + "," + zoom;
         keyList.push(key) 
         if ( this.tileCache[key] == null ) {
            var vurl             = this.params.GetMapURL       ( tx, ty, zoom );
            var rurl             = this.params.GetDatasetURL   ( tx, ty, zoom );
            this.tileCache[key]  = new Tile ( zoom, this.gl, this.glAsset );
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
   var timeRemaining = MapParameter.refreshRate;
   for (var ki = 0 ; ki < keyList.length ; ki++) {      
      var tile = this.tileCache[keyList[ki]];
      if (tile &&  tile.IsLoad () && !tile.IsUpToDate () )  {
         hasSomeChange        = true
         timeRemaining        = tile.Update( timeRemaining , this.params.GetStyle() , this.zoom )
         if ( timeRemaining <= 0 )
            break;
      }
   }
   return hasSomeChange
}

//----------------------------------------------------------------------//

GLMap.prototype.DrawScene = function (forceGlobalRedraw,forceTileRedraw) {
   
   if(typeof(forceGlobalRedraw)==='undefined' )
      forceGlobalRedraw = false
   if(typeof(forceTileRedraw)==='undefined' )
      forceTileRedraw = false

   var w = this.mapElement.width();
   var h = this.mapElement.height();
   if (w != this.w || h != this.h) {
      this.w  = w;
      this.h  = h;
      this.mapCanvas.width  = this.w;
      this.mapCanvas.height = this.h;
      this.gl.viewportWidth  = this.w;
      this.gl.viewportHeight = this.h;
   }

   var w2 = Math.floor ( w / 2 );
   var h2 = Math.floor ( h / 2 );

   var r       = this.coordS.Resolution ( this.zoom );
   var originM = new Point( this.centerM.x - w2 * r , this.centerM.y + h2 * r );
   var tileC   = this.coordS.MetersToTile ( originM.x, originM.y , this.zoom );

   var originP = this.coordS.MetersToPixels ( originM.x, originM.y, this.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameter.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameter.tileSize - originP.y ) ) );

   var nbTileX = Math.floor ( w  / MapParameter.tileSize +1 );
   var nbTileY = Math.floor ( h  / MapParameter.tileSize  +1 ) ; 

   if ( this.UpdateTileCache ( this.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y , forceTileRedraw ) || forceGlobalRedraw) {
      if ( !   this.glAsset.shaderProgramTex.isLoad ||  this.glAsset.shaderProgramTex.error || !this.glAsset.shaderProgramWTex.isLoad    || 
               this.glAsset.shaderProgramWTex.error  || !this.glAsset.shaderProgramData.isLoad || this.glAsset.shaderProgramData.error  )
         return
      mvMatrix      = mat4.create();
      pMatrix       = mat4.create();
      mat4.identity    ( pMatrix );
      mat4.ortho       ( 0, w , h, 0 , 0, 1, pMatrix ); // Y swap !
      this.gl.viewport ( 0, 0, w , h );
      this.gl.clear    ( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
      var layerDataParams = [this.params.GetContrast(),this.params.GetLuminosity(),this.params.GetBWMethod()]
      for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameter.tileSize , tx = tx + 1) {
         for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+ MapParameter.tileSize , ty = ty - 1) {
            mat4.identity (mvMatrix);
            mat4.translate(mvMatrix, [wx +1, wy +1, 0]);
            var key  = tx + "," + ty + "," + this.zoom;
            var tile = this.tileCache[key]
            tile.Render ( pMatrix, mvMatrix, this.params, this.glAsset );
         }
      }
   }
}

//----------------------------------------------------------------------//

GLMap.prototype.DrawMagnifier = function () {
   
   var scale = 3;
   var w = this.magnifierCanvas.width;
   var h = this.magnifierCanvas.height;
   var left = (w/2)/scale;
   var top = (h/2)/scale;
   var r = this.coordS.Resolution ( this.zoom );

   var originM = new Point( this.mouseM.x - left * r , this.mouseM.y + top * r );
   var tileC   = this.coordS.MetersToTile ( originM.x, originM.y , this.zoom );

   var originP = this.coordS.MetersToPixels ( originM.x, originM.y, this.zoom );
   var shift   = new Point ( Math.floor ( tileC.x * MapParameter.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * MapParameter.tileSize - originP.y ) ) );

   var nbTileX = Math.floor ( w  / MapParameter.tileSize +1 );
   var nbTileY = Math.floor ( h / MapParameter.tileSize  +1 ) ; 

   var ctxMagnifier = this.magnifierCanvas.getContext("2d");
   ctxMagnifier.save();
   ctxMagnifier.scale(scale, scale);

   // wx/wy (pixels) in canvas mark ( coord ) !!
   for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + MapParameter.tileSize , tx = tx + 1) {
      for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+MapParameter.tileSize , ty = ty - 1) {
         var key  = tx + "," + ty + "," + this.zoom;
         var tile = this.tileCache[key] 
         if ( tile && tile.isLoad && !tile.error) {
            ctxMagnifier.beginPath();
            ctxMagnifier.rect(wx, wy , MapParameter.tileSize, MapParameter.tileSize);
            ctxMagnifier.closePath();
            ctxMagnifier.fillStyle = '#FFFFFF';
            ctxMagnifier.fill();
            ctxMagnifier.beginPath();
            ctxMagnifier.closePath();
            ctxMagnifier.drawImage(tile.cnv,wx,wy);
         }
         else {
            ctxMagnifier.beginPath();
            ctxMagnifier.rect(wx, wy , MapParameter.tileSize, MapParameter.tileSize);
            ctxMagnifier.closePath();
            ctxMagnifier.fillStyle = '#EEEEEE';
            ctxMagnifier.fill();
            ctxMagnifier.beginPath();
            ctxMagnifier.closePath();
         }
      }
   }    
   
   ctxMagnifier.restore();
   
   this.DrawMagnifierSight(ctxMagnifier);
}

//----------------------------------------------------------------------//

GLMap.prototype.EditStyle = function (event) {
   
   // retrieve the tile clicked
   var tileCoord = this.coordS.MetersToTile ( this.mouseM.x, this.mouseM.y , this.zoom );
   var key = tileCoord.x + "," + tileCoord.y + "," + this.zoom;

   var tile = this.tileCache[key];
   
   if(!tile.IsLoad())
      return;

   // find the click coordinates inside invisibleCanvas
   // http://map.x-ray.fr/wiki/pages/viewpage.action?pageId=2097159 [3rd graph]
   var clickP = this.coordS.MetersToPixels ( this.mouseM.x, this.mouseM.y, this.zoom );
   
   var tileClickCoord = new Point(Math.floor (clickP.x - tileCoord.x*MapParameter.tileSize), Math.floor ( (tileCoord.y+1) * MapParameter.tileSize - clickP.y ) );

   // create an invisibleCanvas to render the pixel for every layers
   var canvas = document.getElementById("dummyTilesCanvas");
   var ctx = canvas.getContext("2d");
   ExtendCanvasContext ( ctx );
   canvas.height = 1;
   canvas.width = 1;

   ctx.translate(-tileClickCoord.x, -tileClickCoord.y);
   ctx.save();

   // render the tile inside this invisibleCanvas with the layerId colors
   var layerId = tile.LayerLookup( tileClickCoord , ctx , this.zoom, this.params.GetStyle() ) ;
   console.log("layerId : " + layerId);

   ctx.restore();

   var gn = StyleMenu.GetGroupNameFilterFromLayerId(layerId);
   if ( gn.group != null && gn.name != null ){
      StyleMenu.__BuildWidget(gn.group,gn.name,gn.uid);
   }
}


//----------------------------------------------------------------------//

//  viseur counterStrike pour le zoom yeah
GLMap.prototype.DrawMagnifierSight = function (ctxMagnifier) {

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

//----------------------------------------------------------------------//
// Utils

GLMap.prototype.getPoint = function (event) {
   var x = event.clientX - $(event.target).offset().left;
   var y = event.clientY - $(event.target).offset().top;
   
   return new Point(x,y);
}

/**
 * param  mouseP : Point with coordinates in pixels, in the Canvas coordinates system
 * return mouseM : Point with coordinates in meters, in the Meters coordinates system
 */
GLMap.prototype.convertPointToMeters = function (mouseP) {

   // distance en pixels par rapport au centre
   var w = this.mapElement.width ();
   var h = this.mapElement.height();
   var deltaX = mouseP.x - w/2;
   var deltaY = mouseP.y - h/2;

   // rajout de la distance par rapport au centre, en metres = coord du point clique en metres
   var r = this.coordS.Resolution ( this.zoom );
   var xM = this.centerM.x + deltaX * r;
   var yM = this.centerM.y - deltaY * r;
   
   return new Point(xM, yM);
}
