
function VectorialLayer ( inGlCtx , inLType) {
   this.cnv          = null;
   this.tex          = null;
   this.ctx          = null;
   this.texCreated   = false
   this.lcnt         = 0;
   this.gl           = inGlCtx;
   this.ltype        = inLType;
}

VectorialLayer.prototype.GetType = function ( ) {
   return this.ltype;
}

VectorialLayer.prototype.Init = function ( data ) {
   this.tex          = this.gl.createTexture();
   this.cnv          = document.createElement("canvas");
   this.cnv.height   = data["h"];
   this.cnv.width    = data["w"];
   this.ctx          = this.cnv.getContext("2d");
   ExtendCanvasContext  ( this.ctx );
   this.ctx.globalCompositeOperation="source-over";

   // Clear ...
   this.ctx.beginPath( );
   this.ctx.rect     ( 0,0,this.cnv.width,this.cnv.height );
   this.ctx.closePath( );
   this.ctx.fillStyle = 'rgba(255,255,255,0.0)';
   this.ctx.fill     ( );
}

VectorialLayer.prototype.Reset = function ( data ) {
   this.lcnt         = 0
   this.texCreated   = false
   delete this.cnv;
   this.cnv          = document.createElement("canvas");
   this.cnv.height   = this.data["h"];
   this.cnv.width    = this.data["w"];
   this.ctx          = this.cnv.getContext("2d");
   ExtendCanvasContext ( this.ctx );
   this.ctx.globalCompositeOperation="source-over";
   this.ctx.beginPath();
   this.ctx.closePath();
}

VectorialLayer.prototype.Release = function (  ) {
   if (this.tex)
      this.gl.deleteTexture ( this.tex );
   if (this.cnv)
      delete this.cnv;
}

VectorialLayer.prototype.IsUpToDate = function ( ) {
   return this.lcnt == null;
}

VectorialLayer.prototype.Update = function ( data, z , style , layerType) {
   var rendererStatus   = TileRenderer.RenderLayers (layerType,  this.ctx , data , z , style , this.lcnt ) ;
   this.lcnt            = rendererStatus[0]
   if (this.lcnt == null) { // Render is finished, build GL Texture
      this._BuildTexture()
   }
   return rendererStatus[1]
}

VectorialLayer.prototype._BuildTexture = function (  ) {
   this.gl.bindTexture  (this.gl.TEXTURE_2D           , this.tex     );
   this.gl.pixelStorei  (this.gl.UNPACK_FLIP_Y_WEBGL  , true         );
   this.gl.texImage2D   (this.gl.TEXTURE_2D           , 0                           , this.gl.RGBA    , this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.cnv);
   this.gl.texParameteri(this.gl.TEXTURE_2D           , this.gl.TEXTURE_MAG_FILTER  , this.gl.NEAREST );
   this.gl.texParameteri(this.gl.TEXTURE_2D           , this.gl.TEXTURE_MIN_FILTER  , this.gl.NEAREST );
   this.gl.bindTexture  (this.gl.TEXTURE_2D           , null         );
   this.texCreated = true
}
