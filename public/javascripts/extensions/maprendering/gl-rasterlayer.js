
function RasterLayer ( inGlCtx, inLType ) {
   this.gl     = inGlCtx;
   this.ltype  = inLType;
   this.tex    = null;
}

RasterLayer.prototype.GetType = function ( ) {
   return this.ltype;
}

RasterLayer.prototype.Init = function ( data ) {
   this.tex             = this.gl.createTexture (      );
   var byteArray        = new Uint8Array        ( data );
   this.gl.bindTexture  (this.gl.TEXTURE_2D, this.tex);
   this.gl.texImage2D   (this.gl.TEXTURE_2D, 0, this.gl.LUMINANCE, MapParameter.tileSize , MapParameter.tileSize, 0, this.gl.LUMINANCE, this.gl.UNSIGNED_BYTE, byteArray);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
   this.gl.bindTexture  (this.gl.TEXTURE_2D, null );
}

RasterLayer.prototype.Reset = function (  ) {
   // Nothing
}

RasterLayer.prototype.Release = function (  ) {
   if (this.tex) {
      this.gl.deleteTexture ( this.tex );
      this.tex = null;
   }
}

RasterLayer.prototype.IsUpToDate = function ( ) {
   return true;
}

RasterLayer.prototype.Update = function ( ) {
   // Nothing
   return 0
}