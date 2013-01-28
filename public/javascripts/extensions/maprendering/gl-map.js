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

Utils.GetURL = function (tx,ty,z) {
   //var url = "http://map.x-ray.fr:8180/api/tile?x="+tx+"&y="+ty+"&z="+z
   //var url = "http://192.168.0.1:8081/api/tile?x="+tx+"&y="+ty+"&z="+z
   var url = "http://map.x-ray.fr/api/tile?x="+tx+"&y="+ty+"&z="+z

   return url

   //Utils.altURL = ["mapsa","mapsb","mapsc","mapsc"];
   /*
   var rd  = Math.floor( (Math.random()*4) );
   var url = "/"+Utils.altURL[rd]+"/";
   return url
    */
}


//=====================================================================================//

function GLMap(map, magnifier, tilesize) {

   //----------------------------------------------------------------------//

   this.tileSize      = typeof tilesize !== 'undefined' ? tilesize : 256;
   this.map           = map;
   this.magnifier     = magnifier;
   this.mouseDown     = false;
   this.lastMouseX    = null;
   this.lastMouseY    = null; 
   var coordS         = new CoordinateSystem ( this.tileSize );
   var inMeter        = coordS.LatLonToMeters( 45.7 , 3.12 )
   this.centerM       = inMeter
   this.zoom          = 14;
   this.tileCache     = {}
   this.coordS        = new CoordinateSystem ( this.tileSize );

   //----------------------------------------------------------------------//

   GLMap.prototype.LoadCanvas = function ( ctx , inUrl , z ) {
      var tile = new Object ( );
      tile.isLoad = false; 
      tile.error  = false;
      tile.lcnt   = 0;
      tile.z      = z;
      tile.data   = null;
      tile.cnv    = null;

      tile.req    = $.ajax({
         type     : "GET",
         url      : inUrl,
         dataType : "json",  
         timeout  : Globals.tileDLTimeOut,
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

      //--------------------//

      var isMagnifying = true; // parametrage possible
      if(isMagnifying)
      {
         this.Magnify(event);
      }
      
      //--------------------//
      
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
      var w        = $("#"+this.map).width ();
      var h        = $("#"+this.map).height();
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

   //----------------------------------------------------------------------//

   GLMap.prototype.SetZoom = function(z){
      if ( z > -1 && z < 19 ){
         this.zoom = z;
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
      this.w = $("#"+this.map).width ();
      this.h = $("#"+this.map).height();
      this.ctx.canvas.width = this.w;
      this.ctx.canvas.height = this.h;
      this.DrawScene ( true );
   }

   //----------------------------------------------------------------------//

   GLMap.prototype.Start = function () {
      try {
         var canvas = document.getElementById(this.map);
         this.ctx=canvas.getContext("2d");
      } catch (e) {
      }

      if (!this.ctx) {
         alert("Could not initialise Canvas 2D");
         return ;
      }

      $(window).resize(Utils.bindObjFuncEvent ( this , "OnResize" ) );

      $("#"+this.map).resize( 
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
               //var gt   = this.coordS.GoogleTile ( tx,ty,this.zoom);
               //var url  = 'test/'+this.zoom+"/"+gt.x+"_"+gt.y+".jsonz"
               var url = Utils.GetURL ( tx,ty,this.zoom )
               this.tileCache[key] = this.LoadCanvas (this.ctx ,url , zoom );
            }
            this.tileCache[key].unusedCpt = 0;
         }
      }
      if ( forceTileRedraw ) {
         for (var key in this.tileCache) {
            if ( this.tileCache[key].isLoad && (!this.tileCache[key].error) ) {
               this.tileCache[key].lcnt = 0
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
       * renderLayer pour les tiles charg√î√∏Œ©s
       * 
       * accDt accumulationDeltatime
       */
      var hasSomeChange = false;
      var time = 0;

      for (var ki = 0 ; ki < keyList.length ; ki++) 
      {
         var tile = this.tileCache[keyList[ki]];

         if ( tile && tile.isLoad && (!tile.error) && tile.lcnt != null ) 
         {
            var rendererStatus  = TileRenderer.RenderLayers ( false, tile.ctx , tile.data , tile.z , tile.lcnt) ;
            hasSomeChange = true
            tile.lcnt = rendererStatus[0]
            time += rendererStatus[1];

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

      var w  = $("#"+this.map).width ();
      var h  = $("#"+this.map).height();
      if (w != this.w || h != this.h) {
         this.w  = w;
         this.h  = h;
         this.ctx.canvas.width  = this.w;
         this.ctx.canvas.height = this.h;
      }

      var w2 = Math.floor ( w / 2 );
      var h2 = Math.floor ( h / 2 );

      var r       = this.coordS.Resolution ( this.zoom );
      var originM = new Point( this.centerM.x - w2 * r , this.centerM.y + h2 * r );
      var tileC   = this.coordS.MetersToTile ( originM.x, originM.y , this.zoom );

      var originP = this.coordS.MetersToPixels ( originM.x, originM.y, this.zoom );
      var shift   = new Point ( Math.floor ( tileC.x * this.tileSize - originP.x ) , Math.floor ( - ( (tileC.y+1) * this.tileSize - originP.y ) ) );

      var nbTileX = Math.floor ( w  / this.tileSize +1 );
      var nbTileY = Math.floor ( h / this.tileSize  +1 ) ; 

      if ( this.UpdateTileCache ( this.zoom , tileC.x , tileC.x + nbTileX , tileC.y - nbTileY , tileC.y , forceTileRedraw ) || forceGlobalRedraw) {
         this.ctx.scale(1,1);
         // wx/wy (pixels) in canvas mark ( coord ) !!
         for ( var wx = shift.x, tx = tileC.x ; wx < w ; wx = wx + this.tileSize , tx = tx + 1) {
            for ( var wy = shift.y, ty = tileC.y ; wy < h ; wy = wy+this.tileSize , ty = ty - 1) {
               var key  = tx + "," + ty + "," + this.zoom;
               var tile = this.tileCache[key] 
               if ( tile && tile.isLoad && !tile.error) {
                  this.ctx.beginPath();
                  this.ctx.rect(wx, wy , this.tileSize, this.tileSize);
                  this.ctx.closePath();
                  this.ctx.fillStyle = '#FFFFFF';
                  this.ctx.fill();
                  this.ctx.beginPath();
                  this.ctx.closePath();
                  this.ctx.drawImage(tile.cnv,wx,wy);
               }
               else {
                  this.ctx.beginPath();
                  this.ctx.rect(wx, wy , this.tileSize, this.tileSize);
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

   //----------------------------------------------------------------------//

   GLMap.prototype.getClick = function (event) {
      var x = event.clientX - $(event.target).offset().left;
      var y = event.clientY - $(event.target).offset().top;
      
      return new Point(x,y);
   }
   
   //----------------------------------------------------------------------//

   GLMap.prototype.EditStyle = function (event) {

      var clickP = this.getClick(event);
      console.log("EditStyle " + clickP.x + " | " + clickP.y);

      // distance en pixels par rapport au centre
      var w = $("#"+this.map).width ();
      var h = $("#"+this.map).height();
      var deltaX = clickP.x - w/2;
      var deltaY = clickP.y - h/2;

      // rajout de la distance par rapport au centre, en metres = coord du point clique en metres
      var r = this.coordS.Resolution ( this.zoom );
      var xM = this.centerM.x + deltaX * r;
      var yM = this.centerM.y - deltaY * r;
      
      // retrieve the tile clicked
      var tileCoord = this.coordS.MetersToTile ( xM, yM , this.zoom );
      var key = tileCoord.x + "," + tileCoord.y + "," + this.zoom;
      
      var tile = this.tileCache[key];
      if(!tile.data)
         return;

      // find the click coordinates inside invisibleCanvas
      // http://map.x-ray.fr/wiki/pages/viewpage.action?pageId=2097159 [3rd graph]
      var clickP = this.coordS.MetersToPixels ( xM, yM, this.zoom );
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

   GLMap.prototype.Magnify = function (event) {
      var clickP = this.getClick(event);

      // get the corresponding pixel in the invisibleCanvas
      var magnifierCanvas = $("#"+this.magnifier)[0];
      var ctxMap = $("#"+this.map)[0].getContext("2d");
      var area = ctxMap.getImageData(clickP.x - 33, clickP.y - 33, 67, 67);

      // copy imageData + magnify
      var ctxZoom = magnifierCanvas.getContext("2d");
      ctxZoom.putImageData(area, 0, 0);
      ctxZoom.drawImage( magnifierCanvas, 0, 0, 3*magnifierCanvas.width, 3*magnifierCanvas.height )
      
      //---------------------------------//
      // viseur counterStrike yeah
      
      ctxZoom.beginPath();
      ctxZoom.moveTo(magnifierCanvas.width/2-20, magnifierCanvas.height/2);
      ctxZoom.lineTo(magnifierCanvas.width/2-4, magnifierCanvas.height/2);      
      ctxZoom.closePath();
      ctxZoom.stroke();      

      ctxZoom.beginPath();
      ctxZoom.moveTo(magnifierCanvas.width/2+4, magnifierCanvas.height/2);
      ctxZoom.lineTo(magnifierCanvas.width/2+20, magnifierCanvas.height/2);      
      ctxZoom.closePath();
      ctxZoom.stroke();      

      ctxZoom.beginPath();
      ctxZoom.moveTo(magnifierCanvas.width/2, magnifierCanvas.height/2-20);
      ctxZoom.lineTo(magnifierCanvas.width/2, magnifierCanvas.height/2-4);      
      ctxZoom.closePath();
      ctxZoom.stroke();      

      ctxZoom.beginPath();
      ctxZoom.moveTo(magnifierCanvas.width/2, magnifierCanvas.height/2+4);
      ctxZoom.lineTo(magnifierCanvas.width/2, magnifierCanvas.height/2+20);      
      ctxZoom.closePath();
      ctxZoom.stroke();   
   }
   
}
