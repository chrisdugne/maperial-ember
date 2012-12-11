/*
function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- this is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}

function getScript(src) {
   //$('head').append('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
   require(src);
}

function getCss(src) {
   $('head').append(' <link rel="stylesheet" type="text/css" href="' + src + '" />');
}

getScript("js/canvasutilities.js");
getScript("js/map.js");
getScript("js/RGBColor.js");
getScript("js/colorpicker.js");

getCss("css/colorpicker.css");
getCss("css/v_mapnifyColorBar.css");
*/

// this is pretty much just a map with some color related functions
// this map cannot be empty. It is initialized/cleared with at least two values (0 and 255).
// First (0) and Last (255) index cannot be modified using Add() / Remove() but only SetFirst() and SetLast() 
// For a value in [0 ; 255], looking for previous and next index currently in map is done using GetNextAndPreviousIndex()
// For a value in [0 ; 255], looking for the corresponding color is done using Get(index,isInterpolated,withMark,isHsl)

function Rainbow(){ 
  var colors = null; // private !!!
                
  this.Colors = function(){  // getter
      return colors;
  } 

  this.Clear = function(){
      colors.clear();
      
      //reset
      this.SetFirst(new RGBColor("blue"));
      this.Add(new RGBColor("green"),128);
      this.SetLast(new RGBColor("red"));
  }
  
  this.Add = function(color,index){  //RGBColor
    if(typeof color === 'undefined'){return;}
    if(typeof index === 'undefined'){return;}
    
    if ( ! color.ok ){return;}
         
    if ( index < 0 || index > 255)
      return;
    
    if ( (index != 0) && (index != 255)){  // cannot change 0 and 255 this way ! use setFirst/Last instead
      colors.put(index,color);
    }
  }

  this.SetFirst = function(color){ //RGBColor
    if(typeof color === 'undefined'){return;}
    if ( ! color.ok ){return;}  
    
    colors.put(0,color);
  }

  this.SetLast = function(color){      //RGBColor
    if(typeof color === 'undefined'){return;}
    
    if ( ! color.ok ){return;}  
    colors.put(255,color);
  }    

  this.Remove = function(index){
    if(typeof index === 'undefined'){return;}
    
    if ( index < 0 || index > 255 || (! colors.containsKey(index)))
      return;
 
    if ( index != 0 && index != 255){  // cannot remove 0 and 255 at all
      colors.removeByKey(index);
    }
  }
  
  this.GetNextAndPreviousIndex = function(index){
    if(typeof index === 'undefined'){return -1;}
    
    var keys = colors.getAllKeys();
    keys.sort(function(a,b){return a - b});
    
    for( var i = 0 ; i < keys.length ; ++i){
      if ( keys[i] > index){
        if ( i > 0){
          return {next: keys[i], previous: keys[i-1]};
        }
        else{
          // should not happend ...
          return {next: keys[0], previous: keys[0]};
        }
      }
    }
    
    //should not happend ...
    return {next: keys[keys.length-1], previous: keys[keys.length-2]};      // it's ok, there is always at least 2 keys in map !
  }   
  
  this.Get = function(index,isInterpolated,withMark,isHsl){
    if(typeof index === 'undefined'){
      var tmp =  new RGBColor("black");
      tmp.setAlpha(0.0);
      return tmp;
    }  
    
    if(typeof isInterpolated === 'undefined')
      var isInterpolated = true;
      
    if(typeof withMark === 'undefined')
      var withMark = false;
      
    if(typeof isHsl === 'undefined')
      var isHsl = true;

    
    if ( index < 0 || index > 255 ){
      var tmp =  new RGBColor("black");
      tmp.setAlpha(0.0);
      return tmp;
    }
    
    if (withMark && colors.containsKey(Math.round(index)) ){
      return new RGBColor("black");     ///@todo  this can used to draw contour plots ... think of it !
    }
    
    var id = this.GetNextAndPreviousIndex(index);
    var idB = id.previous;
    var idT = id.next;
    
    if ( idB < 0 || idT < 0){
      var tmp =  new RGBColor("black");
      tmp.setAlpha(0.0);
      return tmp;
    }
    
    if ( ! isInterpolated){
      //return colors.get(idB); // stupid basic dummy crappy test
      if ( index >= (idT+idB)*0.5 )
        return colors.get(idT);
      else
        return colors.get(idB);
    }    
    
    //interpolated case
    var c = this.Interp(idB,idT,index,isHsl);
    
    return c;
  }

  this.Interp = function(bottom,top,index,isHsl){
    if(typeof isHsl === 'undefined')
      var isHsl = true;
  
    if ( bottom == top )
      return colors.get(idT);

    var ic = new RGBColor("white");
    var bottomC = colors.get(bottom);
    var topC    = colors.get(top);
   
    if ( ! isHsl ){
        // dont forget to round off float
        ///@todo ensure (r,g,b) in [0,255] !
        ic.r = Math.round(bottomC.r + (topC.r - bottomC.r)/(top-bottom)*(index-bottom));
        ic.g = Math.round(bottomC.g + (topC.g - bottomC.g)/(top-bottom)*(index-bottom));
        ic.b = Math.round(bottomC.b + (topC.b - bottomC.b)/(top-bottom)*(index-bottom));
        ic.a = bottomC.a + (topC.a - bottomC.a)/(top-bottom)*(index-bottom);
    }
    else{
        var hsvB = bottomC.toHsv();
        var hsvT = topC.toHsv();
        var hsvH = hsvB.H + (hsvT.H - hsvB.H)/(top-bottom)*(index-bottom);
        var hsvS = hsvB.S + (hsvT.S - hsvB.S)/(top-bottom)*(index-bottom);
        var hsvV = hsvB.V + (hsvT.V - hsvB.V)/(top-bottom)*(index-bottom);
        var hsv = {H:hsvH,S:hsvS,V:hsvV};
        ic.fromHsv(hsv);      // will apply the rounding needed !
        ic.a = bottomC.a + (topC.a - bottomC.a)/(top-bottom)*(index-bottom);
    }
    
    return ic;
  }

  colors = new Map(); // instanciate data
  this.Clear();       // initialize data
}
      
function generateGuid() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
      if( j == 8 || j == 12|| j == 16|| j == 20)
          result = result + '_';
      i = Math.floor(Math.random()*16).toString(16).toUpperCase();
      result = result + i;
  }
  return result;
}
      
      
////////////////////////////////////////////
////////////////////////////////////////////
//////////////////////////////////////////// 
// color Bar object
// offsets are "in canvas" offset. They are provided because **** YOU MUST NOT USE CSS PADDING *** for canvas !!!!!!    
     
function Bar(_width,_height,_mainDiv,_offsetX,_offsetY,_doInterpo,_minVal,_maxVal,_isMovable){
  
  /////////////////////////
  //settings default params (private variable)
  /////////////////////////
  var canvasId        ;
  var colorPickerId   ;
  var width           ;
  var height          ;
  var minVal          ;
  var maxVal          ;  
  var offsetX         ;
  var offsetY         ;
  var doInterpo       ;  
  var fontsize        ;
  var isHsl           ;
  var canvasW         ;
  var canvasH         ;

  var globalUID       = generateGuid(); // allow multiple colorBar ;-)

  canvasId        = "cb_canvas_"+globalUID;
  colorPickerId   = "colorpicker_colorBar_"+globalUID;
  isHsl           = false;

  // the rainbow of colors :-)  
  var rainbow = null; 

  //canvas context
  var context = null;

  //this will be a color picker object reference
  var colorPicker = null;
  
  //used in callbacks for mouse event
  var oldPos     = -1;
  var lastAdded  = -1;
  var clicked    = false;
  var _color     = null;  
  
  //this callback will be called each time a color changes  (!! deprecated !!)
  var onUpdateCallback = null;

  //reference of me ... used in callbacks and private methods
  var self = this; 



  /////////////////////////
  //settings default params
  /////////////////////////
  function Init(in_width,in_height,in_mainDiv,in_offsetX,in_offsetY,in_doInterpo,in_minVal,in_maxVal){
    
    width           = in_width || 75;
    height          = in_height || 600;
    ///@todo setters !!!!!
    minVal          = in_minVal || 0;
    maxVal          = in_maxVal || 100;
      
    offsetX         = in_offsetX || 20;
    offsetY         = in_offsetY || 20;
    doInterpo       = in_doInterpo;  
    fontsize        = height / 35;
  
    canvasW         = in_width + 2 * offsetX + 10 * fontsize;
    canvasH         = in_height + 2 * offsetY;  
  }

  /////////////////////////
  // get call back for colorpicker (ensure colorPickerId is fine)
  /////////////////////////
  function GetColorPickerCallBack(){
      return function (hsb, hex, rgb) {
          $("#" + colorPickerId + " div").css('backgroundColor', '#' + hex);   // update picker view
          self.ColorCallBack(hex);  // update bar
      }  
  }

  /////////////////////////
  // Init view thing 
  /////////////////////////
  function InitView(){
    
    _mainDiv.empty(); // clear container
  
    _mainDiv.css('width',canvasW + 20);
  
    // add an inner div of class mapnifyColorBarDiv (allow css tuning)
    var mapnifyColorBarDiv = $("<div class=\"mapnifyColorBarDiv\"></div>");
    mapnifyColorBarDiv.appendTo(_mainDiv);
     
    //add the canvas for colorBar
    $("<canvas class=\"cb_canvas\" id=\"" + canvasId + "\" width=\"" + canvasW +"\" height=\"" + canvasH + "\"></canvas>").appendTo(mapnifyColorBarDiv);

    //get the canvas context
    context = document.getElementById(canvasId).getContext("2d");

    //add the dirty color param div  // let say this is just temporary stuff ... :-S
    var tmp = ''                                                                          +
        '<div class="cb_colorpickerWrap">'                                                + 
        '  <div class="cb_pikerLegend">'                                                  +
        '      Change last added / selected color :'                                      +
        '  </div>'                                                                        +
        '  <div class="cb_colorpicker" id="cb_colorpicker_' + globalUID + '">'            +
        '  </div>'                                                                        +
        '  <form>'                                                                        +
        '  <input type="checkbox" class="cb_Interp" id="cb_Interp_' + globalUID + '" value="interp" checked> interp <br/>'       +
        '  <input type="checkbox" class="cb_Hsl"    id="cb_Hsl_'    + globalUID + '" value="hsl" checked> hsl/rbg <br/>'         +
        '  <input type="button"   class="cl_Clear"  id="cb_Clear_'  + globalUID + '" value="Reset" checked> <br/>'               +
        '  </form>'                                                                       +
        '</div>'                                                                          +
        '';
    $(tmp).appendTo(mapnifyColorBarDiv);
  
    // register the button callbacks 
    $('#cb_Interp_'+ globalUID).click(function()    {self.toggleInterp();});
    $('#cb_Hsl_'   + globalUID).click(function()    {self.toggleHsl();   });
    $('#cb_Clear_' + globalUID).click(function()    {self.Clear();       });
   
    // add colorPicker (new version with jquery)
    $("<div class=\"colorSelector\" id=\"" + colorPickerId + "\"><div style=\"background-color:" + RGBAToHex("rgba(30,50,80,1.0)") + "\"></div></div>").appendTo($("#cb_colorpicker_"+globalUID));
         
    $("#"+colorPickerId).ColorPicker({
      	color: RGBAToHex("rgba(30,50,80,1.0)"),
      	//flat : true,
       	onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
       },
       onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
       },
       onChange: GetColorPickerCallBack()
    });
    
    colorPicker = $('#'+colorPickerId);  
    // end tmp
  
    // register mouse event callbacks in canvas
    $('#'+canvasId).mousedown(onMouseDown);
    $('#'+canvasId).mouseup(onMouseUp);
    $('#'+canvasId).mousemove(onMouseDrag);    
    
    //configure the colorBar "window"
    /* 
    _mainDiv.dialog({
       title: "The color Bar :-)",
       position: "right",
       width:'auto',
       height : 850,
       maxHeight : 850,
       resizable: false,
       closeOnEscape: false,
       open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }       
    });
    */
    if ( _isMovable ){
       _mainDiv.draggable();//.resizable({handles : "e, w" });
       _mainDiv.draggable({ cancel: "canvas" }); //disable draggable for inner canvas obj
    }
 
//    _mainDiv.animate({left:"800"},1000);
//    _mainDiv.animate({top:"90"},1000);
//    _mainDiv.css('position','absolute');
//    _mainDiv.css('right','400');
//    _mainDiv.css('top','0');

 
   }

  /////////////////////////
  // View thing depends on colorBar width and height ... So need to ReInit everything sometimes !
  /////////////////////////
  this.ReInit = function(in_width,in_height,in_mainDiv,in_offsetX,in_offsetY,in_doInterpo,in_minVal,in_maxVal){
     Init(in_width,in_height,in_mainDiv,in_offsetX,in_offsetY,in_doInterpo,in_minVal,in_maxVal);
     InitView();
     this.Render();
  }

  /////////////////////////
  // Some get/set-ers
  /////////////////////////
  this.setWidth = function(w){
    this.ReInit(w ,height,_mainDiv,offsetX,offsetY,doInterpo,minVal,maxVal);
  }
  
  this.setHeight = function(h){
    this.ReInit(width ,h,_mainDiv,offsetX,offsetY,doInterpo,minVal,maxVal);
  }
  
  this.setMinVal = function(m){
    this.ReInit(width ,height,_mainDiv,offsetX,offsetY,doInterpo,m,maxVal);
  }
  
  this.setMaxVal = function(M){
    this.ReInit(width ,height,_mainDiv,offsetX,offsetY,doInterpo,minVal,M);
  }
  
  this.setInterp = function(b){
    doInterpo = b;
  }
  
  this.getInterp = function(){
    return doInterpo;
  }

  this.toggleInterp = function(){
    this.setInterp(!this.getInterp());
    this.Render();
  }

  this.setUpdateCallBack = function(func){
    onUpdateCallback = func;
  }
  
  this.getUpdateCallBack = function(){
    return onUpdateCallback;
  }

  this.setHsl = function(b){
    isHsl = b;
  }
  
  this.getHsl = function(){
    return isHsl;
  }
  
  this.toggleHsl = function(){
    this.setHsl(!this.getHsl());
    this.Render();
  }  
  
  /////////////////////////
  // private drawing functions
  /////////////////////////
  function DrawMainRect(){
    /* 
    //Title
    context.beginPath();
    context.lineWidth    = "2";   
    context.strokeStyle  = "#000";
    context.fillStyle    = "#000";
    context.font         = fontsize*1.35 + 'px sans-serif';

    context.fillText     ("ColorScale with Canvas POC",offsetX/4,offsetY*2/6 + 0.85*fontsize);
    context.fill();
    */
    //Color bar border
    context.beginPath();
    context.lineWidth    = "2";   
    context.strokeStyle  = "#000";
    context.fillStyle    = "#000";
    
    context.rect         (offsetX-1,offsetY-1,width+2,height+2);
    context.stroke();
  }

  function DrawTick(j,curIndex,color){
      //Arrow
      context.lineWidth="1";   
      context.strokeStyle  = color.toHex();
      context.fillStyle    = color.toHex();
      drawArrow            (context,width+offsetX+7*fontsize/2,j+offsetY,width+offsetX+fontsize/3,j+offsetY);
      //Box
      context.strokeStyle  = "#000";
      context.fillStyle    = "#000";
      context.roundedRect  (width+offsetX+8*fontsize/2, j-fontsize/1.5+offsetY, fontsize*6.5, fontsize*1.5, fontsize*0.5/*,false,true*/);
      //Label
      context.font         = fontsize + 'px sans-serif';
      var curVal           = minVal + (maxVal - minVal)/255.*curIndex;
      context.fillText     (curIndex + ' (' + Math.round(curVal*100)/100 + ')',width+offsetX+9*fontsize/2,j+offsetY+fontsize/2.5);
      context.stroke       ();
  }
  
  /////////////////////////
  // render is public  ... but you should probably not use it much...
  /////////////////////////
  this.Render = function(){
  
    //clear canvas !
    context.clear();
    
    DrawMainRect();
    
    var tickMark = new Map();
    
    for(var j = 0 ; j < height ; ++j){
        var curIndex = Math.round((height-1-j)*255/(height-1));
        var color = rainbow.Get(curIndex,doInterpo,true,isHsl);
        var realColor = rainbow.Get(curIndex,doInterpo,false,isHsl);
        
        if ( ! color.ok ){
          var tmp =  new RGBColor("black");
          tmp.setAlpha(0.0);
          return tmp;
        }    
        
        if ( rainbow.Colors().containsKey(curIndex) ){
          if (! tickMark.containsKey(curIndex)){
              DrawTick(j,curIndex,realColor);
              tickMark.put(curIndex,true);
          }
        }
        
        // line by line ...
        context.lineWidth = 1;
        context.strokeStyle  = color.toRGBA();
        context.fillStyle    = color.toRGBA();
        //context.strokeStyle  = color.toRGB();
        //context.fillStyle    = color.toRGB();
        context.beginPath();
        context.moveTo(offsetX , offsetY + j);
        context.lineTo(offsetX + width , offsetY + j);
        context.stroke()      
    }
    
  }
  
  /////////////////////////
  // Now, some bridge to Rainbow get/set-ers
  /////////////////////////
  this.Add = function(color,index){
    rainbow.Add(color,index);
  }
  
  this.AddFirst = function(color){
    rainbow.SetFirst(color);
    if ( onUpdateCallback ) {
      onUpdateCallback (this);
    }    
  }

  this.AddLast = function(color){
    rainbow.SetLast(color);
    if ( onUpdateCallback ) {
      onUpdateCallback (this);
    }
  }     
  
  this.GetIndex = function(value){
    return 0. + (255. - 0.)/(maxVal-minVal)*(value-minVal);
  }

  this.GetColor = function(index){
    return rainbow.Get(index,doInterpo,false,isHsl);
  }
  
  this.Clear = function(){
    rainbow.Clear();
    this.Render();
  }

  /////////////////////////
  // This is call on mouse click and by ColorCallBack
  /////////////////////////
  this.Change = function(oldIndex,newIndex,color){
    if ( newIndex < 0 ){
      return;
    }
    if ( oldIndex > -1 ){
      var mid = Math.min(oldIndex,newIndex);
      var Mid = Math.max(oldIndex,newIndex);
      for(var k = mid ; k <= Mid ; ++k){
        rainbow.Remove(k);
      }
    }
    rainbow.Remove(newIndex);
    rainbow.Add(color,newIndex);
    
    //update colorpicker current value !
    console.log(color.toHex().replace("#",""));
    colorPicker.ColorPickerSetColor(color.toHex().replace("#","")); // jquery version
    $("#" + colorPickerId + " div").css('backgroundColor', color.toHex());   // update picker view
        
    if ( onUpdateCallback ) {   // not used anymore
      onUpdateCallback (this);
    }
  }
  
  /////////////////////////
  // the colorPiker call back ! 
  // what to do when user change color params ?
  // see above for instatiation of the picker itseft 
  // and link with this callback
  /////////////////////////
  this.ColorCallBack = function(color){     // note that "color" here must be a string understandable by RGBColor !!!
    if ( lastAdded == 0)
      self.AddFirst(new RGBColor(color));
    else if (lastAdded == 255 )
      self.AddLast(new RGBColor(color));
    else
      self.Change(lastAdded,lastAdded,new RGBColor(color));
      
    self.Render();
  }
  
  /////////////////////////
  /// private tools
  /////////////////////////
  function getCursorX(canvas, event) {
    var x;
    var canoffset = $(canvas).offset();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left) + 1;
    return x;
  }  
     
  function getCursorY(canvas, event) {
    var y;
    var canoffset = $(canvas).offset();
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
    return y;
  }  
  
  /////////////////////////   
  /// mouse event callbacks   
  /////////////////////////                           
  function onMouseDown(evt){
    
    var curX = getCursorX(document.getElementById(canvasId),evt);
    var curY = getCursorY(document.getElementById(canvasId),evt);
    
    var curPos = Math.round((height-1-curY+offsetY)*255.0/(height-1));   ///@todo check offset
    var curPos2 = curPos;
  
    var id = rainbow.GetNextAndPreviousIndex(curPos);
    var nearestLowerIndex = id.previous;
    var nearestUpperIndex = id.next;
    
    if ( ! clicked ){
      if ( Math.abs(nearestLowerIndex-curPos) < height/40 ){
           curPos2 = nearestLowerIndex;
           _color = rainbow.Get(nearestLowerIndex,false,false);
           clicked = true;
      }
      else{
        if ( Math.abs(nearestUpperIndex-curPos) < height/40 ){
           curPos2 = nearestUpperIndex;
           _color = rainbow.Get(nearestUpperIndex,false,false);
           clicked = true;
        }
      }      
    }
  
    if ( ! clicked ){
      // test random RGB
      //var randR = Math.floor(Math.random()*256);
      //var randG = Math.floor(Math.random()*256);
      //var randB = Math.floor(Math.random()*256);
      // test random HSV
      //var hslH = Math.random()*6;
      //var hslS = 1;
      //var hslV = 1;
      //_color = new RGBColor("white");
      //_color.fromHsv({H:hslH,S:hslS,V:hslV});
      // interpolated value
      _color = rainbow.Interp(nearestLowerIndex,nearestUpperIndex,curPos,isHsl);
      
      if ( ! _color.ok){   // something went wrong ...
        _color = new RGBColor("black");
        _color.setAlpha(0.0);
      }
      
    }
    
    lastAdded = curPos2;
    
    self.Change(oldPos,curPos2,_color);
    oldPos = curPos2;
    self.Render();
    clicked = true;
  }
  
  function onMouseUp(evt){
    clicked = false;  
    oldPos = -1;
  }
  
  function onMouseDrag(evt){
     if ( clicked )
        onMouseDown(evt);
  }        
                   
  
  /////////////////////////
  // Instantiation and callback setup
  /////////////////////////
  // instanciate rainbow map
  rainbow = new Rainbow();

  this.ReInit(_width,_height,_mainDiv,_offsetX,_offsetY,_doInterpo,_minVal,_maxVal);
  
  return this;
}




           

