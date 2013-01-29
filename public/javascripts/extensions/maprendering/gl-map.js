//=====================================================================================//
//uniquement cote wwwClient

if(typeof(Globals)==='undefined' || Globals == null) Globals={}
if(typeof(Utils)==='undefined' || Utils == null) Utils={}

//=====================================================================================//
//a mettre dans webapp/globals.js


Globals.refreshRate   = 30; // ms
Globals.tileDLTimeOut = 60000 ; //ms

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

function GLMap(mapName, magnifierName, tilesize) {

   //----------------------------------------------------------------------//

   this.tileSize      = typeof tilesize !== 'undefined' ? tilesize : 256;

   this.magnifierCanvas = $("#"+magnifierName)[0];
   this.magnifierElement = $("#"+magnifierName);
   this.mapCanvas     = $("#"+mapName)[0];
   this.mapElement    = $("#"+mapName);
   this.mouseDown     = false;
   this.lastMouseX    = null;
   this.lastMouseY    = null;
   this.coordS         = new CoordinateSystem ( this.tileSize );
   this.centerM       = this.coordS.LatLonToMeters( 45.7 , 3.12 );
   this.mouseM        = this.centerM;
   this.zoom          = 14;
   this.tileCache     = {};
   this.params        = new MapParameter(); 
   
   //----------------------------------------------------------------------//
   
   GLMap.prototype.GetParams = function (  ) {
      return this.params;
   }

   //----------------------------------------------------------------------//

   GLMap.prototype.LoadCanvas = function ( inUrl , z ) {
      var tile = new Object ( );
      tile.isLoad       = false; 
      tile.error        = false;
      tile.texCreated   = false;
      tile.lcnt         = 0;
      tile.z            = z;
      tile.data         = null;
      tile.cnv          = null;
      tile.tex          = this.gl.createTexture();

      tile.req    = $.ajax({
         type     : "GET",
         url      : inUrl,
         dataType : "json",  
         timeout  : Globals.tileDLTimeOut,
         success  : function(data, textStatus, jqXHR) {
            if ( ! data ) {
               tile.isLoad = true;
               tile.error  = true;
               return
            }
            tile.data      = data;
            tile.cnv       = document.createElement("canvas");
            tile.cnv.height= data["h"];
            tile.cnv.width = data["w"];

            tile.ctx=tile.cnv.getContext("2d");
            ExtendCanvasContext ( tile.ctx );
            tile.ctx.globalCompositeOperation="source-over";
            tile.ctx.beginPath();
            tile.ctx.closePath();
            tile.isLoad     = true;
            tile.error      = false;
         },
         error : function(jqXHR, textStatus, errorThrown) {
            tile.isLoad = true;
            tile.error  = true;
            console.log ( inUrl + " : loading failed : " + textStatus );
         }
      });    
      
      return tile
   }

   //----------------------------------------------------------------------//

   GLMap.prototype.OnMouseDown = function (event) {
      this.mouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      
      var isEditingStyle = true; // parametrage possible
      if(isEditingStyle)
      {
         this.EditStyle(event);
      }
   }

   GLMap.prototype.OnMouseUp = function (event) {
      this.mouseDown = false; 
   }
   
   GLMap.prototype.OnMouseMove = function (event) {

      // refresh magnifier
      var mouseP = this.getPoint(event);
      this.mouseM = this.convertPointToMeters ( mouseP );
      this.DrawMagnifier ( true );
      
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

   GLMap.prototype.GetZoom = function(){
      return this.zoom;
   }

   //----------------------------------------------------------------------//

   GLMap.prototype.OnResize = function (event) {
      this.w = this.mapElement.width ();
      this.h = this.mapElement.height();
      this.mapCanvas.width = this.w;
      this.mapCanvas.height = this.h;
      
      this.DrawScene ( true );
   }


   GLMap.prototype.OnParamsChange = function (event) {
      if (event == MapParameter.StyleChanged) {
         this.DrawScene (true,true)
      }
      else if (event == MapParameter.ColorBarChanged) {
      }
      else if (event == MapParameter.ContrastChanged) {
      }
      else if (event == MapParameter.LuminosityChanged) {
      }
      else if (event == MapParameter.BWMethodChanged) {
      }
   }

   //----------------------------------------------------------------------//
   GLMap.prototype.InitGL = function () {
      var vertices       = [ 0.0, 0.0, 0.0, 256.0, 0.0, 0.0, 0.0, 256.0, 0.0, 256.0, 256.0, 0.0 ];
      var textureCoords  = [ 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0 ]; // Y swap
   
      this.squareVertexPositionBuffer           = this.gl.createBuffer();
      this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer );
      this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW );
      this.squareVertexPositionBuffer.itemSize  = 3;
      this.squareVertexPositionBuffer.numItems  = 4;

      this.squareVertexTextureBuffer            = this.gl.createBuffer();
      this.gl.bindBuffer   ( this.gl.ARRAY_BUFFER, this.squareVertexTextureBuffer );
      this.gl.bufferData   ( this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW );
      this.squareVertexTextureBuffer.itemSize   = 2;
      this.squareVertexTextureBuffer.numItems   = 4;
      
      this.gl.clearColor   ( 0.0, 1.0, 0.0, 1.0  );
      this.gl.disable      ( this.gl.DEPTH_TEST  );

      this.shaderProgramTex  = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertexTex.json" , "assets/shader/fragmentTex.json"  , null); 
      this.shaderProgramWTex = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertex.json"    , "assets/shader/fragment.json"     , null);
      this.shaderProgramData = this.gltools.MakeProgram   ( this.gl , "assets/shader/vertexTex.json" , "assets/shader/fragmentData.json" , null);
   }
   
   GLMap.prototype.Start = function () {
      try {
         this.gl = this.mapCanvas.getContext("experimental-webgl");
         this.gl.viewportWidth = canvas.width;
         this.gl.viewportHeight = canvas.height;
      } catch (e) { }
      if (!this.gl) {
         alert("Could not initialise WebGL, sorry :-(");
         return ;
      }

      this.gltools = new GLTools ()
      this.InitGL()
      
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
      setInterval( Utils.bindObjFunc ( this, "DrawScene" ) , Globals.refreshRate );
   } 


   //----------------------------------------------------------------------//

   
   GLMap.prototype.UpdateTileCache = function (zoom, txB , txE , tyB , tyE, forceTileRedraw) {
      var keyList = [];
      for ( tx = txB ; tx <= txE ; tx = tx + 1) {
         for ( ty = tyB ; ty <= tyE ; ty = ty + 1) {
            var key = tx + "," + ty + "," + zoom;
            keyList.push(key) 
            if ( this.tileCache[key] == null ) {
               var url = this.params.GetMapURL ( tx,ty,this.zoom )
               this.tileCache[key] = this.LoadCanvas ( url , zoom );
            }
            this.tileCache[key].unusedCpt = 0;
         }
      }
      if ( forceTileRedraw ) {
         for (var key in this.tileCache) {
            if ( this.tileCache[key].isLoad && (!this.tileCache[key].error) ) {
               this.tileCache[key].lcnt = 0
               this.tileCache[key].texCreated = false
               delete this.tileCache[key].cnv;
               this.tileCache[key].cnv       = document.createElement("canvas");
               this.tileCache[key].cnv.height= this.tileCache[key].data["h"];
               this.tileCache[key].cnv.width = this.tileCache[key].data["w"];
               this.tileCache[key].ctx=this.tileCache[key].cnv.getContext("2d");
               ExtendCanvasContext ( this.tileCache[key].ctx );
               this.tileCache[key].ctx.globalCompositeOperation="source-over";
               this.tileCache[key].ctx.beginPath();
               this.tileCache[key].ctx.closePath();
            }
         }
      }
      
      // unload unnecessary loaded tile
      for (var key in this.tileCache) {
         var isInKeyList = false
         for (var ki = 0 ; ki < keyList.length ; ki++) {
            if (keyList[ki] === key)
               isInKeyList = true
         }
         if ( ! isInKeyList ) {
            if ( this.tileCache[key].isLoad ) {
               this.gl.deleteTexture ( this.tileCache[key].tex );
               delete this.tileCache[key].data;
               delete this.tileCache[key].cnv;
               this.tileCache[key].req.abort () ;
               delete this.tileCache[key].req;
               delete this.tileCache[key];
            }
         }
      }
      
      /*
       * 
       * tile.lcnt pour savoir ou on en est lors du rendu : offset
       * -> pour reprendre ou on en etait
       * 
       * isLoad : isLoaded
       * 
       * renderLayer pour les tiles charg�s
       * 
       * accDt accumulationDeltatime
       */
      var hasSomeChange = false;
      var time = 0;
      
      for (var ki = 0 ; ki < keyList.length ; ki++) {      
      
         var tile = this.tileCache[keyList[ki]];
         
         if ( tile && tile.isLoad && (!tile.error) && tile.lcnt != null )  {         
            var rendererStatus   = TileRenderer.RenderLayers (false,  tile.ctx , tile.data , tile.z , this.params.GetStyle() , tile.lcnt ) ;
            hasSomeChange        = true
            tile.lcnt            = rendererStatus[0]
            time                 += rendererStatus[1];

            if (tile.lcnt == null) { // Render is finished, build GL Texture
               this.gl.bindTexture  (this.gl.TEXTURE_2D           , tile.tex     );
               this.gl.pixelStorei  (this.gl.UNPACK_FLIP_Y_WEBGL  , true         );
               this.gl.texImage2D   (this.gl.TEXTURE_2D           , 0                           , this.gl.RGBA    , this.gl.RGBA, this.gl.UNSIGNED_BYTE, tile.cnv);
               this.gl.texParameteri(this.gl.TEXTURE_2D           , this.gl.TEXTURE_MAG_FILTER  , this.gl.NEAREST );
               this.gl.texParameteri(this.gl.TEXTURE_2D           , this.gl.TEXTURE_MIN_FILTER  , this.gl.NEAREST );
               this.gl.bindTexture  (this.gl.TEXTURE_2D           , null         );
               tile.texCreated = true
            }

            if ( time > ( Globals.refreshRate - 5 ) )
               break;
         }
      }
      
      return hasSomeChange
   }

   

   //----------------------------------------------------------------------//

   GLMap.prototype.DrawScene = function (forceGlobalRedraw,forceTileRedraw) {
      
      if(typeof(forceGlobalRedraw)==='undefined' ) {
         forceGlobalRedraw = false
      }
      if(typeof(forceTileRedraw)==='undefined' ) {
         forceTileRedraw = false
      }

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
      var shift   = new Point ( Math.floor ( tileC.x * 256 - originP.x ) , Math.floor ( - ( (tileC.y+1) * 256 - originP.y ) ) );

      var nbTileX = Math.floor ( w  / this.tileSize +1 );
      var nbTileY = Math.floor ( h / this.tileSize  +1 ) ; 

      if ( this.UpdateTileCache ( this.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y , forceTileRedraw ) || forceGlobalRedraw) {
         if ( ! this.shaderProgramTex.isLoad || this.shaderProgramTex.error  )
            return

         mvMatrix      = mat4.create();
         pMatrix       = mat4.create();
         mat4.identity    ( pMatrix );
         mat4.ortho       ( 0, w , h, 0 , 0, 1, pMatrix ); // Y swap !
         this.gl.viewport ( 0, 0, w , h );
         this.gl.clear    ( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
         
         for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + this.tileSize , tx = tx + 1) {
            for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+this.tileSize , ty = ty - 1) {
               var key  = tx + "," + ty + "," + this.zoom;
               var tile = this.tileCache[key] 
               mat4.identity (mvMatrix);
               mat4.translate(mvMatrix, [wx +1, wy +1, 0]);
               
               if ( tile && tile.isLoad && !tile.error && tile.texCreated) {
                  this.gl.useProgram(this.shaderProgramTex);
                  this.gl.uniformMatrix4fv(this.shaderProgramTex.params.pMatrixUniform, false, pMatrix);
                  this.gl.uniformMatrix4fv(this.shaderProgramTex.params.mvMatrixUniform, false,mvMatrix);
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
                  this.gl.enableVertexAttribArray(this.shaderProgramTex.attr.vertexPositionAttribute);
                  this.gl.vertexAttribPointer(this.shaderProgramTex.attr.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
                  
                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexTextureBuffer);
                  this.gl.enableVertexAttribArray(this.shaderProgramTex.attr.textureCoordAttribute);
                  this.gl.vertexAttribPointer(this.shaderProgramTex.attr.textureCoordAttribute, this.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
                  
                  this.gl.activeTexture(this.gl.TEXTURE0);
                  this.gl.bindTexture(this.gl.TEXTURE_2D, tile.tex );
                  this.gl.uniform1i(this.shaderProgramTex.params.samplerUniform, 0);
                  this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
               }
               else {
                  this.gl.useProgram               (this.shaderProgramWTex);
                  this.gl.uniformMatrix4fv         (this.shaderProgramWTex.params.pMatrixUniform, false, pMatrix);
                  this.gl.uniformMatrix4fv         (this.shaderProgramWTex.params.mvMatrixUniform, false,mvMatrix);
                  this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
                  this.gl.enableVertexAttribArray  (this.shaderProgramWTex.attr.vertexPositionAttribute);
                  this.gl.vertexAttribPointer      (this.shaderProgramWTex.attr.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
                  this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
               }
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
      var shift   = new Point ( Math.floor ( tileC.x * this.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * this.tileSize - originP.y ) ) );

      var nbTileX = Math.floor ( w  / this.tileSize +1 );
      var nbTileY = Math.floor ( h / this.tileSize  +1 ) ; 

      var ctxMagnifier = this.magnifierCanvas.getContext("2d");
      ctxMagnifier.save();
      ctxMagnifier.scale(scale, scale);

      // wx/wy (pixels) in canvas mark ( coord ) !!
      for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + this.tileSize , tx = tx + 1) {
         for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+this.tileSize , ty = ty - 1) {
            var key  = tx + "," + ty + "," + this.zoom;
            var tile = this.tileCache[key] 
            if ( tile && tile.isLoad && !tile.error) {
               ctxMagnifier.beginPath();
               ctxMagnifier.rect(wx, wy , this.tileSize, this.tileSize);
               ctxMagnifier.closePath();
               ctxMagnifier.fillStyle = '#FFFFFF';
               ctxMagnifier.fill();
               ctxMagnifier.beginPath();
               ctxMagnifier.closePath();
               ctxMagnifier.drawImage(tile.cnv,wx,wy);
            }
            else {
               ctxMagnifier.beginPath();
               ctxMagnifier.rect(wx, wy , this.tileSize, this.tileSize);
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
      if(!tile.data)
         return;

      // find the click coordinates inside invisibleCanvas
      // http://map.x-ray.fr/wiki/pages/viewpage.action?pageId=2097159 [3rd graph]
      var clickP = this.coordS.MetersToPixels ( this.mouseM.x, this.mouseM.y, this.zoom );
      var tileClickCoord = new Point(Math.floor (clickP.x - tileCoord.x*this.tileSize), Math.floor ( (tileCoord.y+1) * this.tileSize - clickP.y  ) );

      // create an invisibleCanvas to render the pixel for every layers
      var canvas = document.getElementById("dummyTilesCanvas");
      var ctx = canvas.getContext("2d");
      ExtendCanvasContext ( ctx );
      canvas.height = 1;
      canvas.width = 1;
      
      ctx.translate(-tileClickCoord.x, -tileClickCoord.y);
      ctx.save();

      // render the tile inside this invisibleCanvas with the layerId colors
      var layerId = TileRenderer.LayerLookup ( tileClickCoord , ctx , tile.data , this.zoom ) ;
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


}
