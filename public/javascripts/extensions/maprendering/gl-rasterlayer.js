
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
   this.gl.bindTexture  (this.gl.TEXTURE_2D, this.tex);
   var byteArray        = new Uint8Array        ( data );
   var ny = byteArray[0] + 1
   byteArray            = new Uint8Array        ( data.slice(1) );
   var nx = byteArray.length / ny
   //this.gl.texImage2D   (this.gl.TEXTURE_2D, 0, this.gl.LUMINANCE, MapParameter.tileSize , MapParameter.tileSize, 0, this.gl.LUMINANCE, this.gl.UNSIGNED_BYTE, byteArray);
   //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
   //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
   this.gl.texImage2D   (this.gl.TEXTURE_2D, 0, this.gl.LUMINANCE, nx , ny, 0, this.gl.LUMINANCE, this.gl.UNSIGNED_BYTE, byteArray)
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S    , this.gl.CLAMP_TO_EDGE);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T    , this.gl.CLAMP_TO_EDGE);
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