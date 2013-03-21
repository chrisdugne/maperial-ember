
function Tile (parameters , x, y, z) {

   //--------------------------------//

   this.groups       = parameters.maperial.config.groups;
   this.layersConfig = parameters.maperial.config.layers;

   this.x         = x;
   this.y         = y;
   this.z         = z;

   this.parameters   = parameters;
   this.assets       = parameters.assets;
   this.gl           = parameters.assets.ctx;
   this.error        = false;

   this.layers    = {};
   this.data      = {};
   this.requests  = {};
   this.load      = {};
   this.errors    = {};

   // preparing double buffering to render as texture !
   this.frameBufferL = [];
   this.texL         = [];
   this.tex          = null;

   //--------------------------------//

   this.Init();
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Init = function () {
   this.initLayers();
   this.loadSources();
   this.prepareBuffering();
}
   
//----------------------------------------------------------------------------------------------------------------------//
   
Tile.prototype.initLayers = function () {

   for(var i = 0; i< this.layersConfig.length; i++){

      switch(this.layersConfig[i].type){

         case LayersManager.Vector:
            this.layers[i] = new VectorialLayer( this.parameters , this.z);
            break;
   
         case LayersManager.Raster:
            this.layers[i] = new RasterLayer( this.parameters , this.z);
            break;
      }

   }
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.loadSources = function () {

 for(var i = 0; i< this.parameters.sources.length; i++){

    var source = this.parameters.sources[i];

    if (this.requests[source.type])
       return false;

    switch(source.type){

       case Source.MaperialOSM:
          this.LoadVectorial ( source );
          break;
   
       case Source.Raster:
          this.LoadRaster ( source );
          break;

    }
 }
 
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.prepareBuffering = function () {
   var gltools = new GLTools ()
   for ( var i = 0 ; i < 2 ; i = i + 1 ) {
      var fbtx = gltools.CreateFrameBufferTex(this.gl, MapParameters.tileSize, MapParameters.tileSize);
      this.frameBufferL.push        ( fbtx[0] );
      this.texL.push                ( fbtx[1] );
   }
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Release = function() {

   for(var i = 0; i< this.parameters.sources.length; i++){

      var source = this.parameters.sources[i];

      if (this.requests[source.type])
         this.requests[source.type].abort();

      for(var j = 0; j< this.layersConfig.length; j++){
         if ( this.layersConfig[j].source.type == source.type )
            this.layers[j].Release();
      } 

      delete this.data[source.type];

      var gl = this.gl;
      for ( var i = 0 ; i < 2 ; i = i + 1 ) {
         gl.deleteFramebuffer ( this.frameBufferL[i] );
         gl.deleteTexture     ( this.texL[i] );
      }

   }
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Reset = function ( ) {
   if(this.IsLoaded()) {
      for (i in this.layers) {      
         this.layers[i].Reset ( );
      }

      this.tex = null;
   }
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.IsLoaded = function ( ) {

   
   for(var i = 0; i< this.parameters.sources.length; i++){
      var source = this.parameters.sources[i];

      if (!this.load[source.type])
         return false;
   }
   
   return true;
}

Tile.prototype.IsUpToDate = function ( ) {
   return this.tex;
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.LoadVectorial = function ( source ) {
   var me = this;
   this.requests[source.type] = $.ajax({
      type     : "GET",
      url      : source.getURL(this.x, this.y, this.z),
      dataType : "json",  
      timeout  : MapParameters.tileDLTimeOut,
      success  : function(data, textStatus, jqXHR) {
         if ( ! data ) {
            me.error[source.type] = true;
         }
         else {
            me.data[source.type] = data;
         }
         
         me.appendDataToLayers(source.type, data);
         me.load[source.type] = true;
      },
      error : function(jqXHR, textStatus, errorThrown) {
         me.error[source.type]   = true;
         me.load[source.type]    = true;
         me.appendDataToLayers(source.type, null);
      }
   });
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.LoadRaster = function ( source ) {
   if ( ! source.getURL(this.x, this.y, this.z) ) {
      this.error[source.type] = true;
      this.load[source.type] = true;
      return ;
   }

   // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Sending_and_Receiving_Binary_Data
   // JQuery can not use XMLHttpRequest V2 (binary data)
   var me = this;   
   this.requests[source.type] = new XMLHttpRequest();
   this.requests[source.type].open ("GET", source.getURL(this.x, this.y, this.z), true);
   this.requests[source.type].responseType = "arraybuffer";

   this.requests[source.type].onload = function (oEvent) {      
      var arrayBuffer = me.requests[source.type].response;  // Note: not this.requests[source.type].responseText
      if (arrayBuffer && ( me.requests[source.type].status != 200 || arrayBuffer.byteLength <= 0 )) {
         arrayBuffer = null;
      }

      me.error[source.type] = arrayBuffer != null;
      me.load[source.type]  = true;
      me.appendDataToLayers(source.type, arrayBuffer);
   };

   this.requests[source.type].onerror = function (oEvent) {
      me.error[source.type] = true;
      me.load[source.type]  = true;
      me.appendDataToLayers(source.type, null);
   }
   
   function ajaxTimeout() { me.requests[source.type].abort(); }
   var tm = setTimeout(ajaxTimeout,MapParameters.tileDLTimeOut);
   
   this.requests[source.type].send(null);
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.appendDataToLayers = function ( sourceType, data ) {
   for(var i = 0; i< this.layersConfig.length; i++){
      if ( this.layersConfig[i].source.type == sourceType )
         this.layers[i].Init( data );
   }   
}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.RenderVectorialLayers = function ( context, wx, wy ) {
   for (i in this.layers) {
      if (this.layers[i].GetType() == LayersManager.Vector && this.layers[i].IsUpToDate() && this.layers[i].cnv) {
         context.drawImage(this.layers[i].cnv, wx, wy);
      }
   }
}

//----------------------------------------------------------------------------------------------------------------------//

/*
 *  render the tile inside an invisibleCanvas with the layerId colors
 */
Tile.prototype.FindSubLayerId = function ( tileClickCoord, zoom, style ) {

   // create an invisibleCanvas to render the pixel for every layers
   var canvas = document.getElementById("dummyTilesCanvas");
   var ctx = canvas.getContext("2d");
   ExtendCanvasContext ( ctx );
   canvas.height = 1;
   canvas.width = 1;

   ctx.translate(-tileClickCoord.x, -tileClickCoord.y);

   for(var i = this.layersConfig.length -1 ; i>=0 ; --i){

      // a ameliorer pour pouvoir PICK sur une source CUSTOM
      if(this.layersConfig[i].source.type != Source.MaperialOSM)
         continue;

      var subLayerId = TileRenderer.FindSubLayerId(tileClickCoord , ctx , this.data[Source.MaperialOSM] , zoom, style, this.layersConfig[i].params.group, this.groups );

      if(subLayerId)
         return subLayerId;
   }

}

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Update = function ( maxTime ) {

   if (this.IsUpToDate() || !this.IsLoaded() )
      return maxTime - 1 ;

   var timeRemaining = maxTime;

   for(var i = 0; i< this.layersConfig.length; i++){
      if (! this.layers[i].IsUpToDate ( ) ) {
         timeRemaining -= this.layers[i].Update( this.layersConfig[i].params );
         if ( timeRemaining <= 0 )
            break;
      }
   }

   var ready = true;
   for (var i in this.layers) {
      if (! this.layers[i].IsUpToDate ( ) )
         ready = false;
   }

   // Get elapsed time !!
   if ( ready )
      this.Compose();

   return timeRemaining; 
}

//----------------------------------------------------------------------------------------------------------------------//

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

//----------------------------------------------------------------------------------------------------------------------//

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

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Compose = function (  ) {

   var backTex = this.layers[0].tex
   var destFb  = this.frameBufferL[ 0 ]
   var tmpI    = 0;

   if ( this.layers.length > 1 ) {
      for( var i = 1 ; i < this.layers.length ; i++ ) {
         var frontTex   = this.layers[i].tex;
         if (frontTex) {
            if (this.layersConfig[i].params.group == VectorialLayer.FRONT) {
               var ttt = 4;
            }
            var prog       = this.assets.prog[ this.layersConfig[i].composition.shader ]
            var params     = this.layersConfig[i].composition.params;
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

//----------------------------------------------------------------------------------------------------------------------//

Tile.prototype.Render = function (pMatrix, mvMatrix) {

   if ( this.IsUpToDate() ) {
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
