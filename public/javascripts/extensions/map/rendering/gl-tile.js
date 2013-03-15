
function Tile (layersConfig, params , tx, ty, z) {

   //----------------------------------------------------------------------------------------------------------------------//

   this.z         = z;
   this.params    = params;
   this.assets    = params.assets;
   this.gl        = params.assets.ctx;
   this.error     = false;
   this.layers    = [];

   this.layersConfig     = layersConfig;
   this.data      = [];
   this.req       = [];
   this.load      = [];
   this.errors    = [];

   //----------------------------------------------------------------------------------------------------------------------//

   for(var i = 0; i< this.layersConfig.length; i++){
      
      switch(this.layersConfig[i].type){
      
         case MapParameters.Vector:
            this.layers.push ( new VectorialLayer( this.params , this.z));
            break;
         
         case MapParameters.Raster:
            this.layers.push ( new RasterLayer( this.params , this.z));
            break;
      }
      
   }

//   for( var i = 0 ; i < this.params.LayerOrder.length ; i++ ) {
//      var lt = this.params.LayerType [i];
//      var lo = this.params.LayerOrder[i];
//      if ( lt == MapParameters.Vector ) {
//         this.layers [ lo ] = new VectorialLayer( this.params , this.z);
//      }
//      else if ( lt == MapParameters.Raster ) { 
//         this.layers [ lo ] = new RasterLayer   ( this.params , this.z);
//      }
//   }

   // prepare double buffering for render to texture !
   this.frameBufferL       = []
   this.texL               = []
   this.tex                = null;

   var gltools = new GLTools ()
   for ( var i = 0 ; i < 2 ; i = i + 1 ) {
      var fbtx = gltools.CreateFrameBufferTex(this.gl, MapParameters.tileSize, MapParameters.tileSize);
      this.frameBufferL.push        ( fbtx[0] );
      this.texL.push                ( fbtx[1] );
   }

   //------------------------------------------------------------------------------------//

   this.Init(tx, ty, z);
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Init = function (tx, ty, z) {

   console.log(this.params.sources);

   for(var i = 0; i< this.params.sources.length; i++){

      var source = this.params.sources[i];
      console.log(source);
      
      if (this.req[source.type])
         return false;
      
      switch(source.type){
      
         case Source.MaperialOSM:
            this._LoadVectorial  ( source.getURL() );
            break;
         
         case Source.MaperialRaster:
            this._LoadRaster  ( source.getURL() );
            break;
            
      }
      
//    if (this.vReq || this.rReq)
//    return false;
//    this._LoadVectorial  ( inVecUrl     );
//    this._LoadRaster     ( inRasterUrl  );
   } 
}

Tile.prototype.Release = function ( inVecUrl, inRasterUrl ) {
   if (this.vReq)
      this.vReq.abort ();
   if (this.rReq)
      this.rReq.abort ();
   for (kl in this.layers) {      
      this.layers [ kl ].Release ( );
   }

   delete this.vdata;
   delete this.rdata;

   var gl = this.gl;
   for ( var i = 0 ; i < 2 ; i = i + 1 ) {
      gl.deleteFramebuffer ( this.frameBufferL[i] );
      gl.deleteTexture     ( this.texL[i] );
   }

}

Tile.prototype.Reset = function ( ) {
   if(this.IsLoad()) {
      for (kl in this.layers) {      
         this.layers [ kl ].Reset ( );
      }

      this.tex = null;
   }
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.IsLoad = function ( ) {
   return ( this.vLoad && this.rLoad );
}

Tile.prototype.IsUpToDate = function ( ) {
   return this.tex;
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype._LoadVectorial = function ( inVecUrl ) {
   var me = this;
   this.vReq    = $.ajax({
      type     : "GET",
      url      : inVecUrl,
      dataType : "json",  
      timeout  : MapParameters.tileDLTimeOut,
      success  : function(data, textStatus, jqXHR) {
         if ( ! data ) {
            me.vError   = true;
         }
         else {
            me.vdata = data;
         }
         for ( var kl in me.layers ) {
            if ( me.layers [ kl ].GetType() == MapParameters.Vector )
               me.layers [ kl ].Init( data );
         }
         me.vLoad = true;
      },
      error : function(jqXHR, textStatus, errorThrown) {
         me.vError   = true;
         me.vLoad    = true;
         for ( var kl in me.layers ) {
            if ( me.layers [ kl ].GetType() == MapParameters.Vector )
               me.layers [ kl ].Init( null );
         }
      }
   });
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype._LoadRaster = function ( inRasterUrl ) {
   if ( ! inRasterUrl ) {
      this.rError   = true;
      this.rLoad    = true;
      return ;
   }
   // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Sending_and_Receiving_Binary_Data
   // JQuery can not use XMLHttpRequest V2 (binary data)
   var me         = this;   
   this.rReq      = new XMLHttpRequest();
   this.rReq.open ("GET", inRasterUrl, true);
   this.rReq.responseType = "arraybuffer";

   this.rReq.onload = function (oEvent) {      
      var arrayBuffer = me.rReq.response;                    // Note: not this.rReq.responseText
      if (arrayBuffer && ( me.rReq.status != 200 || arrayBuffer.byteLength <= 0 )) {
         arrayBuffer = null;
      }
      for ( var kl in me.layers ) {
         if ( me.layers [ kl ].GetType() == MapParameters.Raster )
            me.layers [ kl ].Init( arrayBuffer );
      }
      me.rError   = arrayBuffer != null;
      me.rLoad    = true;
   };
   this.rReq.onerror = function (oEvent) {
      me.rLoad    = true;
      me.rError   = true;
      for ( var kl in me.layers ) {
         if ( me.layers [ kl ].GetType() == MapParameters.Raster )
            me.layers [ kl ].Init( null );
      }
   }
   function ajaxTimeout() { me.rReq.abort(); }
   var tm = setTimeout(ajaxTimeout,MapParameters.tileDLTimeOut);
   this.rReq.send(null);
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.RenderVectorialLayers = function ( context, wx, wy ) {
   for (kl in this.layers) {
      if (this.layers[kl].GetType() == MapParameters.Vector && this.layers [ kl ].IsUpToDate () && this.layers [ kl ].cnv) {
         context.drawImage(this.layers [ kl ].cnv, wx, wy);
      }
   }
}

//----------------------------------------------------------------------------------------------------------------------//

/*
 *  render the tile inside an invisibleCanvas with the layerId colors
 */
Tile.prototype.LayerLookup = function ( tileClickCoord, zoom, style ) {

   // create an invisibleCanvas to render the pixel for every layers
   var canvas = document.getElementById("dummyTilesCanvas");
   var ctx = canvas.getContext("2d");
   ExtendCanvasContext ( ctx );
   canvas.height = 1;
   canvas.width = 1;

   ctx.translate(-tileClickCoord.x, -tileClickCoord.y);

   for (var i = this.params.LayerOrder.length-1 ; i >= 0 ; --i) {
      var layerResult = TileRenderer.LayerLookup(tileClickCoord , ctx , this.vdata , zoom, style, this.params.LayerOrder[i] );

      if(layerResult)
         return layerResult;
   }

}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Update = function ( maxTime ) {

   if (this.tex)
      return maxTime - 1 ;
   if ( !this.IsLoad() )
      return maxTime - 1 ;

   var timeRemaining = maxTime;

   for( var i = 0 ; i < this.params.LayerOrder.length ; i++ ) {   
      var kl = this.params.LayerOrder[i]
      if (! this.layers [ kl ].IsUpToDate ( ) ) {
         timeRemaining -= this.layers[kl].Update( i );
         if ( timeRemaining <= 0 )
            break;
      }
   }

   var isFinish = true;
   for (var kl in this.layers) {
      if (! this.layers [ kl ].IsUpToDate ( ) )
         isFinish = false
   }

   if ( isFinish )
      // Get elapsed time !!
      this.Compose()

      return timeRemaining 
}

Tile.prototype.Fuse = function ( backTex,frontTex,destFB, prog, params ) {
   var gl                           = this.gl;
   gl.bindFramebuffer               ( gl.FRAMEBUFFER, destFB );

   this.gl.clearColor               ( 1.0, 1.0, 1.0, 1.0  );
   this.gl.disable                  ( this.gl.DEPTH_TEST  );
   gl.viewport                      ( 0, 0, destFB.width, destFB.height);
   gl.clear                         ( gl.COLOR_BUFFER_BIT );

   mvMatrix                         = mat4.create();
   pMatrix                          = mat4.create();
   mat4.identity                    ( pMatrix );
   mat4.identity                    ( mvMatrix );
   mat4.ortho                       ( 0, destFB.width , 0, destFB.height, 0, 1, pMatrix ); // Y swap !

   this.gl.useProgram               (prog);
   this.gl.uniformMatrix4fv         (prog.params.pMatrixUniform , false, pMatrix);
   this.gl.uniformMatrix4fv         (prog.params.mvMatrixUniform, false, mvMatrix);
   this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexPositionBuffer);
   this.gl.enableVertexAttribArray  (prog.attr.vertexPositionAttribute);
   this.gl.vertexAttribPointer      (prog.attr.vertexPositionAttribute, this.assets.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexTextureBuffer);
   this.gl.enableVertexAttribArray  (prog.attr.textureCoordAttribute);
   this.gl.vertexAttribPointer      (prog.attr.textureCoordAttribute, this.assets.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.activeTexture            (this.gl.TEXTURE0);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, backTex );
   this.gl.uniform1i                (prog.params.uSamplerTex1, 0);

   this.gl.activeTexture            (this.gl.TEXTURE1);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, frontTex );
   this.gl.uniform1i                (prog.params.uSamplerTex2, 1);

   this.gl.drawArrays               (this.gl.TRIANGLE_STRIP, 0, this.assets.squareVertexPositionBuffer.numItems);

   for (var k in params) {
      // WRONG !!!!! always  uniform3fv ???
      this.gl.uniform3fv             (prog.params[k] , params[k] ); 
   }

   gl.bindFramebuffer               ( gl.FRAMEBUFFER, null );
   this.gl.activeTexture            (this.gl.TEXTURE0);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, null );
   this.gl.activeTexture            (this.gl.TEXTURE1);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, null );
}

Tile.prototype.Copy = function ( backTex , destFB ) {
   var gl                           = this.gl;

   gl.bindFramebuffer               ( gl.FRAMEBUFFER, destFB );

   this.gl.clearColor               ( 1.0, 1.0, 1.0, 1.0  );
   this.gl.disable                  ( this.gl.DEPTH_TEST  );
   gl.viewport                      ( 0, 0, destFB.width, destFB.height);
   gl.clear                         ( gl.COLOR_BUFFER_BIT );

   mvMatrix                         = mat4.create();
   pMatrix                          = mat4.create();
   mat4.identity                    ( pMatrix );
   mat4.identity                    ( mvMatrix );
   mat4.ortho                       ( 0, destFB.width , 0, destFB.height, 0, 1, pMatrix ); // Y swap !

   var prog = this.assets.prog["Tex"];

   this.gl.useProgram               (prog);
   this.gl.uniformMatrix4fv         (prog.params.pMatrixUniform , false, pMatrix);
   this.gl.uniformMatrix4fv         (prog.params.mvMatrixUniform, false, mvMatrix);
   this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexPositionBuffer);
   this.gl.enableVertexAttribArray  (prog.attr.vertexPositionAttribute);
   this.gl.vertexAttribPointer      (prog.attr.vertexPositionAttribute, this.assets.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexTextureBuffer);
   this.gl.enableVertexAttribArray  (prog.attr.textureCoordAttribute);
   this.gl.vertexAttribPointer      (prog.attr.textureCoordAttribute, this.assets.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.activeTexture            (this.gl.TEXTURE0);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, backTex );
   this.gl.uniform1i                (prog.params.uSamplerTex1, 0);
   this.gl.drawArrays               (this.gl.TRIANGLE_STRIP, 0, this.assets.squareVertexPositionBuffer.numItems);

   gl.bindFramebuffer               ( gl.FRAMEBUFFER, null );
   this.gl.activeTexture            (this.gl.TEXTURE0);
   this.gl.bindTexture              (this.gl.TEXTURE_2D, null );
}

Tile.prototype.Compose = function (  ) {
   var backTex = this.layers      [ this.params.LayerOrder[0] ].tex
   var destFb  = this.frameBufferL[ 0 ]
   var tmpI    = 0;
   if ( this.params.LayerOrder.length > 1 ) {
      for( var i = 1 ; i < this.params.LayerOrder.length ; i++ ) {
         var frontTex   = this.layers [ this.params.LayerOrder[i] ].tex
         if (frontTex) {
            if (this.params.LayerOrder[i] == "front") {
               var ttt = 4;
            }
            var prog       = this.assets.prog[ this.params.ComposeShader[i] ]
            var params     = this.params.ComposeParams[i]
            this.Fuse      ( backTex,frontTex,destFb, prog , params);
         }
         else {
            this.Copy (backTex,destFb);
         }
         backTex        = this.texL[tmpI];
         this.tex       = backTex;
         tmpI           = ( tmpI + 1 ) % 2;
         destFb         = this.frameBufferL[ tmpI ];
      }
   }
   else {
      this.Copy (backTex,destFb);
      this.tex = this.texL[0];
   }
}

Tile.prototype.Render = function (pMatrix, mvMatrix) {

   if ( this.tex ) {
      var prog                         = this.assets.prog["Tex"];

      this.gl.useProgram               (prog);
      this.gl.uniformMatrix4fv         (prog.params.pMatrixUniform , false, pMatrix);
      this.gl.uniformMatrix4fv         (prog.params.mvMatrixUniform, false, mvMatrix);
      this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexPositionBuffer);
      this.gl.enableVertexAttribArray  (prog.attr.vertexPositionAttribute);
      this.gl.vertexAttribPointer      (prog.attr.vertexPositionAttribute, this.assets.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

      this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.assets.squareVertexTextureBuffer);
      this.gl.enableVertexAttribArray  (prog.attr.textureCoordAttribute);
      this.gl.vertexAttribPointer      (prog.attr.textureCoordAttribute, this.assets.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

      this.gl.activeTexture            (this.gl.TEXTURE0);
      this.gl.bindTexture              (this.gl.TEXTURE_2D, this.tex );

      var err = this.gl.getError();
      if ( err != 0 )
         console.log ( err );

      this.gl.uniform1i                (prog.params.uSamplerTex1, 0);
      this.gl.drawArrays               (this.gl.TRIANGLE_STRIP, 0, this.assets.squareVertexPositionBuffer.numItems);

      this.gl.activeTexture            (this.gl.TEXTURE0);
      this.gl.bindTexture              (this.gl.TEXTURE_2D, null );
   }
}
