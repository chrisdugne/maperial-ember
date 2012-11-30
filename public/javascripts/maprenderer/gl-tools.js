
function RenderLayer ( ctx ,  layer ) {
   id = layer["i"]
   cl = layer["c"]
   ll = layer["g"]
   if (ll == null) return 
   for ( l = 0 ; l < ll.length ; ++l ) {
      lines = ll[l]
      for ( li = 0 ; li < lines.length ; ++li ) {
         line = lines[li]
         ctx.beginPath();
         ctx.moveTo(line[0],line[1]);
         for (p = 2 ; p < line.length - 1 ; p = p + 2) {
            ctx.lineTo(line[p],line[p+1]);      
         }
         if ( line[line.length-1] == "c")
            ctx.closePath()
         this[cl](ctx); 
      }
   }
}

function LoadCanvasAsTexture ( gl , inUrl , inCallback ) {
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.error   = false;
   tex.req     = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "json",  
      success  : function(data, textStatus, jqXHR) {
         tex.svgRenderer = document.createElement("canvas");
         tex.svgRenderer.height = 256;
         tex.svgRenderer.width  = 256;
         
         for ( i = 0 ; i < data["l"].length ; ++i ) {
            RenderLayer  (  tex.svgRenderer.getContext("2d") , data["l"][i] )
         }
         
         //canvg(tex.svgRenderer, data);
         gl.bindTexture(gl.TEXTURE_2D, tex);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.svgRenderer);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.bindTexture(gl.TEXTURE_2D, null);
         tex.isLoad    = true;
         tex.Error     = false;
         inCallback() ;
      },
      error : function(jqXHR, textStatus, errorThrown) {
         tex.isLoad = true;
         tex.error  = true;
         console.log ( inUrl + " : loading failed : " + textStatus );
         inCallback ({},{});
      }
   });    
   return tex
}

function LoadSvgAsTexture ( gl , inUrl , inCallback ) {
   /*var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.error   = false;
   tex.req     = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "text",  
      success  : function(data, textStatus, jqXHR) {
         tex.svgRenderer = document.createElement("canvas");
         canvg(tex.svgRenderer, data
            //,{
            //   ignoreMouse       : true,
            //   ignoreAnimation   : true,
            //   ignoreDimensions  : true,
            //   renderCallback    : function() {
            //      gl.bindTexture(gl.TEXTURE_2D, tex);
            //      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            //      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.svgRenderer);
            //      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            //      gl.bindTexture(gl.TEXTURE_2D, null);
            //      tex.isLoad    = true;
            //      tex.Error     = false;
            //      inCallback() ;
            //   }
            ///
         );
         gl.bindTexture(gl.TEXTURE_2D, tex);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.svgRenderer);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.bindTexture(gl.TEXTURE_2D, null);
         tex.isLoad    = true;
         tex.Error     = false;
         inCallback() ;
      },
      error : function(jqXHR, textStatus, errorThrown) {
         shader.isLoad = true;
         shader.error  = true;
         console.log ( inUrl + " : loading failed : " + textStatus );
         inCallback ({},{});
      }
   });    */
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.error   = false;
   var img     = new Image;
   tex.req     = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "text",  
      success  : function(data, textStatus, jqXHR) {
         img.onload = function(){
            tex.svgRenderer = document.createElement("canvas");
            var ctx = tex.svgRenderer.getContext('2d');
            ctx.drawImage(img,0,0);
            
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.svgRenderer);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
            tex.isLoad    = true;
            tex.Error     = false;
            inCallback() ;  
         };
         img.src    = "data:image/svg+xml;base64,"+btoa(data);
      },
      error : function(jqXHR, textStatus, errorThrown) {
         shader.isLoad = true;
         shader.error  = true;
         console.log ( inUrl + " : loading failed : " + textStatus );
         inCallback ({},{});
      }
   });
   return tex
}

function LoadShader ( gl , inUrl , inCallback ) {
   var shader     = new Object ( );
   var callback   = inCallback;
   
   shader.isLoad  = false;
   shader.error   = false;
   shader.url     = inUrl;
   shader.obj     = null;
   
   shader.req = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "json",  
      success  : function(data, textStatus, jqXHR) {
         shader.isLoad = true;
         if (data.type == "x-shader/x-fragment") {
            shader.obj = gl.createShader(gl.FRAGMENT_SHADER);
         } else if (data.type == "x-shader/x-vertex") {
            shader.obj = gl.createShader(gl.VERTEX_SHADER);
         } else {
            shader.error  = true;
            return;
         }
         data.code = data.code.replace (/---/g,"\n") 
         gl.shaderSource(shader.obj, data.code);
         gl.compileShader(shader.obj);
         if (!gl.getShaderParameter(shader.obj, gl.COMPILE_STATUS)) {
            shader.error  = true;            //alert(gl.getShaderInfoLog(shader));
            console.log ( "Build " + inUrl + " : Failed ! " );
            console.log (gl.getShaderInfoLog(shader.obj));            
         }
         else {
            shader.error  = false;
         }
         //console.log ( inUrl + " : loading Ok " );
         callback ( data.attributes , data.parameters );
      },
      error : function(jqXHR, textStatus, errorThrown) {
         shader.isLoad = true;
         shader.error  = true;
         console.log ( inUrl + " : loading failed : " + textStatus );
         callback ({},{});
      }
   });
   return shader;
}

function MakeProgram ( inGl , inVertexUrl , inFragmentUrl , inCallback ) {
   var gl               = inGl;
   var attributes       = {};
   var parameters       = {};
   var shaderProgram    = gl.createProgram();
   shaderProgram.isLoad = false;
   shaderProgram.error  = false;
   shaderProgram.attr   = {};
   shaderProgram.params = {};

   callback = function ( inAttributes , inParameters ) {
      jQuery.extend(attributes, inAttributes);
      jQuery.extend(parameters, inParameters);
      if (shaderProgram.fragmentShader.isLoad && shaderProgram.vertexShader.isLoad) {
         if ( !shaderProgram.fragmentShader.error && !shaderProgram.vertexShader.error ) {
            //console.log ( "try to make programm");
            //console.log (shaderProgram.fragmentShader.url ); 
            //console.log (shaderProgram.vertexShader.url );
            gl.attachShader( shaderProgram , shaderProgram.vertexShader.obj);
            gl.attachShader( shaderProgram , shaderProgram.fragmentShader.obj);
            gl.linkProgram ( shaderProgram );
            if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
               alert("Could not initialise shaders");
               shaderProgram.error  = true;
               shaderProgram.isLoad = true;
               return ;
            }       
            gl.useProgram(shaderProgram);
            for (var key in attributes) {
               shaderProgram.attr[key]    = gl.getAttribLocation( shaderProgram, attributes[key] ); 
            }
            for (var key in parameters) {
               shaderProgram.params[key]  = gl.getUniformLocation(shaderProgram, parameters[key]);
            }
            shaderProgram.error  = false;
            shaderProgram.isLoad = true;
            //console.log ( "Make program ok");
         }
         else {
            shaderProgram.isLoad = true;
            shaderProgram.error  = true;
         }
         inCallback(); 
      }
   }

   
   shaderProgram.vertexShader    = LoadShader( gl, inVertexUrl  ,  callback);
   shaderProgram.fragmentShader  = LoadShader( gl, inFragmentUrl,  callback);
   return shaderProgram; 
}

function LoadTexture (gl , url , callback) {
/*
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.image   = new Image();
   tex.image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      tex.isLoad = true;
      delete tex.image;
      callback() ; 
   }
   
   tex.image.src = url;
   return tex;
   */
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.error   = false;
   var   img   = new Image();
   img.onload  = function () {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      tex.isLoad = true;
      delete img;
      callback() ; 
   };
   img.onerror =  function () {
      tex.isLoad = true;
      tex.error  = true;
      delete img;
   };
   img.onabort = function () {
      tex.isLoad = true;
      tex.error  = true;
      delete img;
   };
   
   img.src = url;
   return tex;
}


function LoadCsvTexture (gl , url , callback) {
/*
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.image   = new Image();
   tex.image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      tex.isLoad = true;
      delete tex.image;
      callback() ; 
   }
   
   tex.image.src = url;
   return tex;
   */
   
   var svgRenderer = document.createElement("canvas");
   canvg(this.svgRenderer, 'test/auv.svg');
   var tex     = gl.createTexture();
   tex.isLoad  = false; 
   tex.error   = false;
   var   img   = new Image();
   img.onload  = function () {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      tex.isLoad = true;
      delete img;
      callback() ; 
   };
   img.onerror =  function () {
      tex.isLoad = true;
      tex.error  = true;
      delete img;
   };
   img.onabort = function () {
      tex.isLoad = true;
      tex.error  = true;
      delete img;
   };
   
   img.src = url;
   return tex;
}


function LoadData (gl, inUrl ) {
   var tex     = gl.createTexture();
   tex.isLoad  = false;
   tex.error   = false;
   
   tex.req = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "json",  
      success  : function(data, textStatus, jqXHR) {
         tex.isLoad = true;
         tex.error  = false;
         
         gl.bindTexture(gl.TEXTURE_2D, tex);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl[data.input_type], data.width , data.height, 0, gl[data.output_type], gl.UNSIGNED_BYTE, new Uint8Array(data.data));
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      },
      error : function(jqXHR, textStatus, errorThrown) {
         tex.isLoad = true;
         tex.error  = true;
         console.log ( inUrl + " : loading failed : " + textStatus );
      }
   });
   
   tex.src = inUrl;
   return tex;   
}