//=============================================================//

VectorialLayer.BACK   = "back";
VectorialLayer.FRONT  = "front";

//=============================================================//

function VectorialLayer ( params, inZoom ) {
   this.params = params;
   this.assets = params.assets;
   this.gl     = params.assets.ctx;

   this.cnv    = null;
   this.tex    = null;
   this.ctx    = null;
   this.data   = null;
   this.lcnt   = 0;
   this.z      = inZoom;
}

VectorialLayer.prototype.GetType = function ( ) {
   return MapParameters.Vector;
}

VectorialLayer.prototype.Init = function ( data ) {
   if (this.tex)
      return;
      
   this.data   = data;
   var gl      = this.gl;
   
   if (data) {
      this.tex             = gl.createTexture();
      this.cnv             = document.createElement("canvas");
      this.cnv.height      = MapParameters.tileSize ;
      this.cnv.width       = MapParameters.tileSize ;
      this.ctx             = this.cnv.getContext("2d");
      ExtendCanvasContext  ( this.ctx );
      this.ctx.globalCompositeOperation="source-over";

      // Clear ...
      this.ctx.beginPath   (  );
      this.ctx.rect        ( 0,0,this.cnv.width,this.cnv.height );
      this.ctx.closePath   (  );
      this.ctx.fillStyle    = 'rgba(255,255,255,0.0)';
      this.ctx.fill        (  );
   }
   else { // create fake !
      this.tex             = gl.createTexture();
      this.lcnt            = null;
      gl.bindTexture       ( gl.TEXTURE_2D           , this.tex     );
      gl.pixelStorei       ( gl.UNPACK_FLIP_Y_WEBGL  , false        );
      var byteArray        = new Uint8Array        ( [1,1,1,0 , 1,1,1,0 , 1,1,1,0 , 1,1,1,0] );
      gl.texImage2D        ( gl.TEXTURE_2D           , 0                           , gl.RGBA, 2 , 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, byteArray)
      gl.texParameteri     ( gl.TEXTURE_2D           , gl.TEXTURE_MAG_FILTER  , gl.NEAREST );
      gl.texParameteri     ( gl.TEXTURE_2D           , gl.TEXTURE_MIN_FILTER  , gl.NEAREST );
      gl.bindTexture       ( gl.TEXTURE_2D           , null         );
   }
}

VectorialLayer.prototype.Reset = function (  ) {
   var gl            = this.gl;
   this.lcnt         = 0
   delete this.cnv;
   this.cnv          = document.createElement("canvas");
   this.cnv.height   = MapParameters.tileSize;
   this.cnv.width    = MapParameters.tileSize;
   this.ctx          = this.cnv.getContext("2d");
   ExtendCanvasContext ( this.ctx );
   this.ctx.globalCompositeOperation="source-over";
   this.ctx.beginPath();
   this.ctx.closePath();
}

VectorialLayer.prototype.Release = function (  ) {
   var gl = this.gl;
   if (this.tex) {
      gl.deleteTexture ( this.tex );
      delete this.tex;
      this.tex = 0
   }
   if (this.cnv) {
      delete this.cnv;
      this.cnv = null;
   }
}

VectorialLayer.prototype.IsUpToDate = function ( ) {
   return this.lcnt == null;
}

VectorialLayer.prototype.Update = function ( params ) {
   var group      = params.group;
   var styleName  = params.style;
   var style      = this.params.GetStyle(styleName);
   if ( ! style ) {
      console.log ( "Invalid style")
      this.lcnt =0 
      this._BuildTexture()
   }
   var rendererStatus   = TileRenderer.RenderLayers (attr,  this.ctx , this.data , this.z , style , this.lcnt ) ;
   this.lcnt            = rendererStatus[0]
   if (this.lcnt == null) { // Render is finished, build GL Texture
      this._BuildTexture()
   }
   return rendererStatus[1]
}

VectorialLayer.prototype._BuildTexture = function (  ) {
   var gl = this.gl;
   gl.bindTexture  (gl.TEXTURE_2D           , this.tex     );
   gl.pixelStorei  (gl.UNPACK_FLIP_Y_WEBGL  , false        );
   gl.texImage2D   (gl.TEXTURE_2D           , 0                           , gl.RGBA    , gl.RGBA, gl.UNSIGNED_BYTE, this.cnv);
   gl.texParameteri(gl.TEXTURE_2D           , gl.TEXTURE_MAG_FILTER  , gl.NEAREST );
   gl.texParameteri(gl.TEXTURE_2D           , gl.TEXTURE_MIN_FILTER  , gl.NEAREST );
   gl.bindTexture  (gl.TEXTURE_2D           , null         );
}
