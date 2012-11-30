
var refreshRate = 30

function bindObjFunc(toObject, methodName){
    return function(){toObject[methodName]()}
}

function bindObjFuncEvent(toObject, methodName){
    return function(mEvent){toObject[methodName](mEvent)}
}

function bindObjFuncEvent2(toObject, methodName){
    return function(mEvent,mDelta){toObject[methodName](mEvent,mDelta)}
}

function GLMap(elementName, tilesize) {
	
	console.log("new GLMap on " + elementName);
	
   this.tileSize      = typeof tilesize !== 'undefined' ? tilesize : 256;
   this.canvasName    = elementName;
   this.mouseDown     = false;
   this.lastMouseX    = null;
   this.lastMouseY    = null; 
   var coordS         = new CoordinateSystem ( this.tileSize );
   //var inMeter        = coordS.LatLonToMeters( 45.744048 + (45.801999 - 45.744048) , 3.031832 + (3.145472 - 3.031832) )
   var inMeter        = coordS.LatLonToMeters( 45.7 , 3.12 )
   this.centerM       = inMeter
   this.zoom          = 14;
   this.tileCache     = {}
   this.coordS        = new CoordinateSystem ( this.tileSize );
   
   


   GLMap.prototype.OnMouseDown = function (event) {
      this.mouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
   }

   GLMap.prototype.OnMouseUp = function (event) {
      this.mouseDown = false;    
   }

   GLMap.prototype.OnMouseMove = function (event) {
      if (!this.mouseDown){
         return;
      }
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
      var w        = $("#"+this.canvasName).width ();
      var h        = $("#"+this.canvasName).height();
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
         this.DrawScene ( true );     
      } 
   }

   GLMap.prototype.Start = function () {

		console.log("start");
      try {
         var canvas = document.getElementById(this.canvasName);
         this.ctx=canvas.getContext("2d");
      } catch (e) {
      }
      if (!this.ctx) {
         alert("Could not initialise Canvas 2D");
         return ;
      }
      $("#"+this.canvasName).mousedown( 
         bindObjFuncEvent ( this , "OnMouseDown" ) 
      ).mouseup (
         bindObjFuncEvent ( this , "OnMouseUp" ) 
      ).mousemove (
         bindObjFuncEvent ( this , "OnMouseMove" )
      ).mouseleave (
         bindObjFuncEvent ( this , "OnMouseUp" ) 
      ).bind('mousewheel', bindObjFuncEvent2 ( this , "OnMouseWheel") );
      this.DrawScene();
      setInterval( bindObjFunc ( this, "DrawScene" ) , refreshRate );
   } 
   

   GLMap.prototype.UpdateTileCache = function (zoom, txB , txE , tyB , tyE) {
      var keyList = [];
      
      for ( tx = txB ; tx <= txE ; tx = tx + 1) {
         for ( ty = tyB ; ty <= tyE ; ty = ty + 1) {
            var key = tx + "," + ty + "," + zoom;
            keyList.push(key) 
            if ( this.tileCache[key] == null ) {
               //var gt   = this.coordS.GoogleTile ( tx,ty,this.zoom);
               //var url  = 'test/'+this.zoom+"/"+gt.x+"_"+gt.y+".jsonz"
               var url = GetURL ( tx,ty,this.zoom )
               this.tileCache[key] = LoadCanvas (this.ctx ,url , zoom );
            }
            this.tileCache[key].unusedCpt = 0;
         }
      }

      // Preload external border :
      // for ( tx = txB-1 ; tx <= txE+1 ; tx = tx + 1) {
         // for ( ty = tyB-1 ; ty <= tyE+1 ; ty = ty + 1) {
            // var key = tx + "," + ty + "," + zoom;
            // keyList.push(key) 
            // if ( this.tileCache[key] == null ) { 
               // var gt = this.coordS.GoogleTile ( tx,ty,this.zoom);
               // var url = 'test/'+this.zoom+"/"+gt.x+"_"+gt.y+".jsonz"
               // this.tileCache[key] = LoadCanvas (this.ctx ,url , zoom );
            // }
            // this.tileCache[key].unusedCpt = 0;
         // }
      // }

      // unload unnecessary loaded tile
      for (var key in this.tileCache) {
         if ( (! ( key in keyList)) && this.tileCache[key].isLoad ) {
            if ( this.tileCache[key].load && (!this.tileCache[key].error) && this.tileCache[key].unusedCpt > 4 ) {
               delete this.tileCache[key].data;
               delete this.tileCache[key].cnv;
               this.tileCache[key].req.abort () ;
               delete this.tileCache[key].req;
               delete this.tileCache[key];
            }
            else {
               this.tileCache[key].unusedCpt = this.tileCache[key].unusedCpt + 1 ;
            }
         }
      }
      var hasSomeChange = false;
      var accDt = 0;
      for (var key in keyList) {
         var tile = this.tileCache[keyList[key]];
         if ( tile && tile.isLoad && (!tile.error) && tile.lcnt != null ) {
            var dd  = RenderLayers ( tile.ctx , tile.data , tile.z , tile.lcnt) ;
            hasSomeChange = true
            tile.lcnt = dd[0]
            accDt += dd[1];
            if ( accDt > ( refreshRate - 5 ) )
               break;
         }
      }
      return hasSomeChange
   }

   GLMap.prototype.DrawScene = function (forceRedraw) {
      if(typeof(forceRedraw)==='undefined' ) {
         forceRedraw = false
      }
      
      var w  = $("#"+this.canvasName).width ();
      var h  = $("#"+this.canvasName).height();
      var w2 = Math.floor ( w / 2 );
      var h2 = Math.floor ( h / 2 );

      var r       = this.coordS.Resolution ( this.zoom );
      var originM = new Point( this.centerM.x - w2 * r , this.centerM.y + h2 * r );
      var originP = this.coordS.MetersToPixels ( originM.x, originM.y, this.zoom );
      var tileC   = this.coordS.MetersToTile ( originM.x, originM.y , this.zoom );

      var shift   = new Point ( Math.floor ( tileC.x * 256 - originP.x ) , Math.floor ( - ( (tileC.y+1) * 256 - originP.y ) ) );

      var nbTileX = Math.floor ( w  / this.tileSize +1 );
      var nbTileY = Math.floor ( h / this.tileSize  +1 ) ; 
      
      maxRenderTime = 0
      if ( this.UpdateTileCache ( this.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y  ) || forceRedraw) {
         //console.log ( maxRenderTime )
         // wx/wy (pixels) in canvas mark ( coord ) !!
         for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + this.tileSize , tx = tx + 1) {
            for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+this.tileSize , ty = ty - 1) {
               var key  = tx + "," + ty + "," + this.zoom;
               var tile = this.tileCache[key] 
               if ( tile && tile.isLoad && !tile.error) {
                  this.ctx.drawImage(tile.cnv,wx,wy);
               }
               else {
                  this.ctx.beginPath();
                  this.ctx.rect(wx, wy , 256, 256);
                  this.ctx.closePath();
                  this.ctx.fillStyle = '#EEEEEE';
                  this.ctx.fill();
                  this.ctx.beginPath();
                  this.ctx.closePath();
               }
            }
         }    
      }
   }
   
	console.log("init GLMap done");
   
}


function LoadCanvas ( ctx , inUrl , z ) {
   var tile = new Object ( );
   tile.isLoad = false; 
   tile.error  = false;
   tile.lcnt   = 0;
   tile.z      = z;
   tile.req    = $.ajax({
      type     : "GET",
      url      : inUrl,
      dataType : "json",  
      success  : function(data, textStatus, jqXHR) {
         if ( ! data          ) {
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
   
   return tile;
}

var altURL = ["mapsa","mapsb","mapsc","mapsc"];
function GetURL (tx,ty,z) {
   var url = "http://map.x-ray.fr:8080/tile?x="+tx+"&y="+ty+"&z="+z
   return url
   /*
   var rd  = Math.floor( (Math.random()*4) );
   var url = "/"+altURL[rd]+"/";
   return url
   */
}

