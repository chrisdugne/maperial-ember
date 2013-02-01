
function Tile ( z , inGlCtx, inGlAsset) {
   this.z      = z;
   this.gl     = inGlCtx;
   this.layers = {}
   
   this.vdata  = null;
   this.rdata  = null;
   this.vReq   = null;
   this.rReq   = null;
   this.vLoad  = false;
   this.rLoad  = false;
   this.vError = false;
   this.rError = false;
   this.error  = false;
   this.glAsset= inGlAsset;
   
   for( var i = 0 ; i < MapParameter.LayerOrder.length ; i++ ) {
      if ( MapParameter.LayerType[i] == MapParameter.Vector ) {
         this.layers [ MapParameter.LayerOrder[i] ] = new VectorialLayer( this.gl , MapParameter.LayerType[i] );
      }
      else if ( MapParameter.LayerType[i] == MapParameter.Raster ) { 
         this.layers [ MapParameter.LayerOrder[i] ] = new RasterLayer   ( this.gl , MapParameter.LayerType[i]);
      }
   }
}

Tile.prototype.Init = function ( inVecUrl, inRasterUrl ) {
   if (this.vReq || this.rReq)
      return false;
   this._LoadVectorial  ( inVecUrl     );
   this._LoadRaster     ( inRasterUrl  );
   return true;
}

Tile.prototype.Release = function ( inVecUrl, inRasterUrl ) {
   if (this.vReq)
      this.vReq.abort ();
   if (this.rReq)
      this.rReq.abort ();
   for( var i = 0 ; i < MapParameter.LayerOrder.length ; i++ ) {
      this.layers [ MapParameter.LayerOrder[i] ].Release ( );
   }
   delete this.vdata;
   delete this.rdata;
}

Tile.prototype.Reset = function ( ) {
   if(this.IsLoad())
   {
      for( var i = 0 ; i < MapParameter.LayerOrder.length ; i++ ) {
         this.layers [ MapParameter.LayerOrder[i] ].Reset (this.vdata);
      }
   }
}

Tile.prototype.IsLoad = function ( ) {
   return ( this.vLoad && this.rLoad );
}

Tile.prototype.IsUpToDate = function ( ) {
   if( !this.vLoad || ! this.rLoad )   return false;
   if ( this.vError )                  return false
      
   for (kl in this.layers) {
      if (! this.layers [ kl ].IsRendered ( ) )
         return false;
   }
   
   return true
}

Tile.prototype._LoadVectorial = function ( inVecUrl ) {
   var me = this;
   this.vReq    = $.ajax({
      type     : "GET",
      url      : inVecUrl,
      dataType : "json",  
      timeout  : MapParameter.tileDLTimeOut,
      success  : function(data, textStatus, jqXHR) {
         if ( ! data ) {
            me.vError   = true;
            me.vLoad    = true;
            return ;
         }
         me.vdata = data;
         for ( var kl in me.layers ) {
            if ( me.layers [ kl ].GetType() == MapParameter.Vector )
               me.layers [ kl ].Init( me.vdata );
         }
         me.vLoad = true;
      },
      error : function(jqXHR, textStatus, errorThrown) {
         me.vError   = true;
         me.vLoad    = true;
         console.log ( inVecUrl + " : loading failed : " + textStatus );
      }
   });
}

Tile.prototype._LoadRaster = function ( inRasterUrl ) {
   // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Sending_and_Receiving_Binary_Data
   // JQuery can not use XMLHttpRequest V2 (binary data)
   
   var me      = this;   
   this.rReq    = new XMLHttpRequest();
   this.rReq.open ("GET", inRasterUrl, true);
   this.rReq.responseType = "arraybuffer";

   this.rReq.onload = function (oEvent) {
      var arrayBuffer = me.rReq.response;                    // Note: not this.rReq.responseText
      if (arrayBuffer) {
         for ( var kl in me.layers ) {
            if ( me.layers [ kl ].GetType() == MapParameter.Raster )
               me.layers [ kl ].Init( arrayBuffer );
         }
      }
      else {
         me.rError   = true;
      }
      me.rLoad    = true;
   };
   function ajaxTimeout() { me.rReq.abort(); }
   var tm = setTimeout(ajaxTimeout,MapParameter.tileDLTimeOut);
   this.rReq.send(null);
}

Tile.prototype.Update = function ( maxTime, style, zoom ) {
   timeRemaining = maxTime;
   for (kl in this.layers) {
      if (! this.layers [ kl ].IsRendered ( ) ) {
         timeRemaining -= this.layers[kl].Render( this.vdata, zoom , style , kl );
         if ( timeRemaining <= 0 )
            break;
      }
   }
   return timeRemaining
}

Tile.prototype.LayerLookup = function ( tileClickCoord , ctx  , zoom, style ) {
   for (var i = MapParameter.LayerOrder.length-1 ; i >= 0 ; --i) {
      var layerResult = TileRenderer.LayerLookup(tileClickCoord , ctx , this.vdata , zoom, style, MapParameter.LayerOrder[i] );
      
      if(layerResult)
         return layerResult;
      
   }
}

   
Tile.prototype.Render = function ( pMatrix, mvMatrix , params) {
   if ( this.IsUpToDate () ) {
      if ( this.rLoad && !this.rError ) {
      
         var layerDataParams = [ params.GetContrast(), params.GetLuminosity(), params.GetBWMethod() ];
      
         this.gl.useProgram               (this.glAsset.shaderProgramData);
         this.gl.uniformMatrix4fv         (this.glAsset.shaderProgramData.params.pMatrixUniform , false, pMatrix);
         this.gl.uniformMatrix4fv         (this.glAsset.shaderProgramData.params.mvMatrixUniform, false, mvMatrix);
         this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.glAsset.squareVertexPositionBuffer);
         this.gl.enableVertexAttribArray  (this.glAsset.shaderProgramData.attr.vertexPositionAttribute);
         this.gl.vertexAttribPointer      (this.glAsset.shaderProgramData.attr.vertexPositionAttribute, this.glAsset.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

         this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.glAsset.squareVertexTextureBuffer);
         this.gl.enableVertexAttribArray  (this.glAsset.shaderProgramData.attr.textureCoordAttribute);
         this.gl.vertexAttribPointer      (this.glAsset.shaderProgramData.attr.textureCoordAttribute, this.glAsset.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
         
         this.gl.activeTexture            (this.gl.TEXTURE0);
         this.gl.bindTexture              (this.gl.TEXTURE_2D, this.layers [ MapParameter.LayerBack ].tex );
         this.gl.uniform1i                (this.glAsset.shaderProgramData.params.samplerUniformBgd, 0  );
         
         this.gl.activeTexture            (this.gl.TEXTURE1);
         this.gl.bindTexture              (this.gl.TEXTURE_2D, this.layers [ MapParameter.LayerFront ].tex );
         this.gl.uniform1i                (this.glAsset.shaderProgramData.params.samplerUniformFgd, 1  );
         
         this.gl.activeTexture            (this.gl.TEXTURE2);
         this.gl.bindTexture              (this.gl.TEXTURE_2D, this.layers [ MapParameter.LayerRaster ].tex );
         this.gl.uniform1i                (this.glAsset.shaderProgramData.params.samplerUniformData, 2 );
         
         this.gl.activeTexture            (this.gl.TEXTURE3);
         this.gl.bindTexture              (this.gl.TEXTURE_2D, this.glAsset.colorB);
         this.gl.uniform1i                (this.glAsset.shaderProgramData.params.samplerUniformCb, 3 );
         
         this.gl.uniform3fv               (this.glAsset.shaderProgramData.params.vec3UniformParams, layerDataParams );
                  
         this.gl.drawArrays               (this.gl.TRIANGLE_STRIP, 0, this.glAsset.squareVertexPositionBuffer.numItems);
      }
      else {
         this.gl.useProgram               (this.glAsset.shaderProgramTex);
         this.gl.uniformMatrix4fv         (this.glAsset.shaderProgramTex.params.pMatrixUniform , false, pMatrix);
         this.gl.uniformMatrix4fv         (this.glAsset.shaderProgramTex.params.mvMatrixUniform, false, mvMatrix);
         this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.glAsset.squareVertexPositionBuffer);
         this.gl.enableVertexAttribArray  (this.glAsset.shaderProgramTex.attr.vertexPositionAttribute);
         this.gl.vertexAttribPointer      (this.glAsset.shaderProgramTex.attr.vertexPositionAttribute, this.glAsset.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
         
         this.gl.bindBuffer               (this.gl.ARRAY_BUFFER, this.glAsset.squareVertexTextureBuffer);
         this.gl.enableVertexAttribArray  (this.glAsset.shaderProgramTex.attr.textureCoordAttribute);
         this.gl.vertexAttribPointer      (this.glAsset.shaderProgramTex.attr.textureCoordAttribute, this.glAsset.squareVertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
         
         this.gl.activeTexture            (this.gl.TEXTURE0);
         this.gl.bindTexture              (this.gl.TEXTURE_2D, this.layers [ MapParameter.LayerBack ].tex );
         this.gl.uniform1i                (this.glAsset.shaderProgramTex.params.samplerUniform, 0);
         this.gl.drawArrays               (this.gl.TRIANGLE_STRIP, 0, this.glAsset.squareVertexPositionBuffer.numItems);
      }
   }
   else {
      this.gl.useProgram                  (this.glAsset.shaderProgramWTex);
      this.gl.uniformMatrix4fv            (this.glAsset.shaderProgramWTex.params.pMatrixUniform , false, pMatrix);
      this.gl.uniformMatrix4fv            (this.glAsset.shaderProgramWTex.params.mvMatrixUniform, false, mvMatrix);
      this.gl.bindBuffer                  (this.gl.ARRAY_BUFFER, this.glAsset.squareVertexPositionBuffer);
      this.gl.enableVertexAttribArray     (this.glAsset.shaderProgramWTex.attr.vertexPositionAttribute);
      this.gl.vertexAttribPointer         (this.glAsset.shaderProgramWTex.attr.vertexPositionAttribute, this.glAsset.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
      this.gl.drawArrays                  (this.gl.TRIANGLE_STRIP, 0, this.glAsset.squareVertexPositionBuffer.numItems);
   }
}
