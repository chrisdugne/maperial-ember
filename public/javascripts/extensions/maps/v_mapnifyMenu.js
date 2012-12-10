//var serverRootDir = "http://192.168.1.19/project/mycarto/wwwClient/";
var serverRootDir = "http://map.x-ray.fr/";

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
   $('head').append('<link rel="stylesheet" type="text/css" href="' + src + '" />');
}
           
getScript("js/v_colortool.js");
getScript("js/v_symbolizer.js");
getScript("js/colorpicker.js");

getCss("css/colorpicker.css");
getCss("css/v_mapnifyMenu.css");
*/
                               
//////////
///
/// ATTENTION c'est moi qui lit les json de style, ils seront dispo pour le renderTile (variable style)
///
/////////


//////////////////////////////////////////////////////////////
// SOME GLOBAL VARS
// id <-> name/filter mapping
var mappingArray = Array();
// groups of layer (roads, urban, landscape, ...)
var groups = null; 
// the style (json)
var __style = null;   // <<<<=== THIS IS WHAT YOU WANT FOR maps.js and renderTile.js
// the mapping (json)
var mapping = null; // link id (in style) with a "real" name & filter

//////////////////////////////////////////////////////////////
// set param = value for layer uid at zoom
///@todo check that zoom issue min/max can overlap ??? 
///@todo check that zoom issue repeted zoom !!
function SetParam(uid,zoom,param,value){
   if ( __style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
        var zmin = __style[uid]["s"][rule]["zmin"];
        var zmax = __style[uid]["s"][rule]["zmax"];
        if ( zoom <= zmax && zoom >= zmin ){
             for( var d in __style[uid]["s"][rule]["s"]){ //def
                for ( var p in __style[uid]["s"][rule]["s"][d] ){ // params
                    if ( p == param ){
                        __style[uid]["s"][rule]["s"][d][p] = value;
                        return true;
                    }
                }
                console.log(" not found , adding!" , uid , zoom , param);
                __style[uid]["s"][rule]["s"][d][param] = value;
               return true;
             }
        }
   }
   console.log(" not found !" , uid , zoom , param);
   return false;
}

function SetParamId(uid,ruid,param,value){
   if ( __style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
      for( var d in __style[uid]["s"][rule]["s"]){ //def
         if( __style[uid]["s"][rule]["s"]["uid"] == ruid ){
            for( var p in __style[uid]["s"][rule]["s"][d] ){ // params
               if ( p == param ){
                  __style[uid]["s"][rule]["s"][d][p] = value;
                  return true;
               }
            }
            console.log(" not found , adding!" , uid , ruid , param);
            __style[uid]["s"][rule]["s"][d][param] = value;
            return true;            
         }
      }
   }
   console.log(" not found !" , uid , ruid , param);
   return false;
}

//////////////////////////////////////////////////////////////
// get param for layer uid at zoom 
///@todo check that zoom issue min/max can overlap ???
///@todo check that zoom issue repeted zoom !! 
function GetParam(uid,zoom,param){
  if ( __style[uid] == undefined ){
      console.log(uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
        var zmin = __style[uid]["s"][rule]["zmin"];
        var zmax = __style[uid]["s"][rule]["zmax"];
        if ( zoom <= zmax && zoom >= zmin ){
             for( var d in __style[uid]["s"][rule]["s"]){ //def
                for ( var p in __style[uid]["s"][rule]["s"][d] ){ // params
                    if ( p == param ){
                        return __style[uid]["s"][rule]["s"][d][p];
                    }
                }
             }
        }
   }
   console.log(" not found !", uid , zoom, param);
   return undefined;
}

function GetParamId(uid,ruid,param){
  if ( __style[uid] == undefined ){
      console.log(uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
      for( var d in __style[uid]["s"][rule]["s"]){ //def
         if ( __style[uid]["s"][rule]["s"]["id"] == ruid ){
            for ( var p in __style[uid]["s"][rule]["s"][d] ){ // params
               if ( p == param ){
                   return __style[uid]["s"][rule]["s"][d][p];
               }
            }
         }
      }
   }
   console.log(" not found !", uid , ruid, param);
   return undefined;
}

//////////////////////////////////////////////////////////////
// uid generator
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

//////////////////////////////////////////////////////////////
// Closure for colorpicker callback
function GetColorPickerCallBack(_ruleId,_uid,_zmin,_zmax,pName){
   return function (hsb, hex, rgb) {
      $("#colorpicker_"+_ruleId +" div").css('backgroundColor', '#' + hex);
      SetParam(_uid,_zmin,pName,HexToRGBA(hex));
      console.log("changed value : " + GetParam(_uid,_zmin,pName) , _uid, _zmin);
   }
}

//////////////////////////////////////////////////////////////
// Closure for spinner callback
function GetSpinnerCallBack(_uid,_zmin,_zmax,pName){  
   return function (event, ui) {
      var newV = ui.value;
      SetParam(_uid,_zmin,pName,newV);
      console.log("changed value : " + GetParam(_uid,_zmin,pName) , _uid, _zmin);
   }
}
  
//////////////////////////////////////////////////////////////
// Closure for checkbox callback
function GetCheckBoxCallBack(uid){
    return function() {
       var vis = $("#check_" + uid + ":checked").val()?true:false;
       console.log( uid, "visible",  vis );
       __style[uid]["visible"] = vis; 
    }
};   
      
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// the menu class ...  
function MapnifyInitMenu(container){

  var mapnifyParentEl = container;

  //////////////////////////////////////////////////////////////
  // the main function
  function Load(){
      LoadGroup();
  }

  //////////////////////////////////////////////////////////////
  // AJaX load group
  function LoadGroup(){
    console.log("Loading groups");
    $.ajax({
       url: serverRootDir+'style/group.json',
       async: false,
       dataType: 'json',
       success: function (data) {
          groups = data;
          LoadMapping();
       }
    });
  }

  function __LoadMapping(data){
     console.log("##### MAPPING ####");
     for(var entrie in mapping){
        console.log(mapping[entrie]["name"]);
        // build mappingArray object
        for( var layer in mapping[entrie]["layers"]){
        	
        	try{
        		console.log("    layer : " + layer);
        		console.log("    filter : " + mapping[entrie]["layers"][layer]["filter"]);
        		console.log("    uid : " + mapping[entrie]["layers"][layer]["id"]);
        		mappingArray[ mapping[entrie]["layers"][layer]["id"] ] = { name : mapping[entrie]["name"] , filter : mapping[entrie]["layers"][layer]["filter"]};
        	}
        	catch(e){
        		console.log(e);
        	}
        }
     }
     LoadStyle();  
  }

  //////////////////////////////////////////////////////////////
  // AJaX load mapping
  function LoadMapping(){
    console.log("Loading mapping");
    $.ajax({
       url: serverRootDir+'style/mapping.jsonz',
       async: false,
       dataType: 'json',
       success: function (data) {
          mapping = data;
          __LoadMapping(data);
       }
    });
  }
  
  // Dirty version ... draw view on the fly ...
  function __LoadStyle(data){
  
    mapnifyParentEl.empty();   
  
    mapnifyParentEl.css('display','none'); // hide me during loading
    mapnifyParentEl.css('width','400px'); // force width (avoid scrollbar issue)
  
    var mainDiv = $("<div id=\"mapnify_menu_div\"</div>");
    mainDiv.appendTo(mapnifyParentEl);
  
    var outterAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifyaccordion\"></div>");
    outterAcc.appendTo(mainDiv);

    for ( var group in groups ){

      console.log(groups[group]);

      $("<h1> Group : " + group + "</h1>").appendTo(outterAcc);
      var groupAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifygroupaccordion_"+group+ "\"></div>");
      groupAcc.appendTo(outterAcc);

      for ( var uid in __style ){

         console.log(group,uid, mappingArray[uid].name);

         if ( $.inArray(mappingArray[uid].name,groups[group]) >= 0) {

           console.log("found ! : " + mappingArray[uid].name );

           $("<h2>" + mappingArray[uid].name + "</h2>").appendTo(groupAcc);
           var divIn = $("<div class=\"inner\"></div>");
           divIn.appendTo(groupAcc);
           $("<strong>Properties :<strong>").appendTo(divIn);
           var ul = $("<ul></ul>");
           ul.appendTo(divIn);         
           $("<li>" + "Filter : " + mappingArray[uid].filter + "</li>").appendTo(ul);

           $("<li>" + "Visible  : " + "<input type=\"checkbox\" id=\"check_" + uid + "\" />" + "</li>").appendTo(ul);
           $("#check_" + uid).click( GetCheckBoxCallBack(uid) );
           $("#check_" + uid).attr('checked', __style[uid]["visible"]);
           
           $("<li>" + "Place : " + __style[uid]["layer"] + "</li>").appendTo(ul);
   
           $("<strong>Rules :</strong>").appendTo(divIn);
  
           var innerAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifyaccordion_"+uid + "\">");
           innerAcc.appendTo(divIn);
  
           for( var rule in __style[uid]["s"] ){
  
              var zmin = __style[uid]["s"][rule]["zmin"];
              var zmax = __style[uid]["s"][rule]["zmax"];
              
              if ( zmin != zmax ){
                 $("<h3>Zoom " + zmin + " to " + zmax + "</h3>").appendTo(innerAcc);
              }
              else{
                 $("<h3>Zoom " + zmin + "</h3>").appendTo(innerAcc);
              }
              var divInIn = $("<div class=\"inner\"></div>");
              divInIn.appendTo(innerAcc);
  
              for ( var def in __style[uid]["s"][rule]["s"] ){
    
                 $("<strong>" + __style[uid]["s"][rule]["s"][def]["rt"] + "</strong>").appendTo(divInIn);
                 var ulul = $("<ul></ul>");
                 ulul.appendTo(divInIn);

                 var ruleId = generateGuid();    ///@todo read from style.json
                        
                 for( var p in SymbolizerParams[__style[uid]["s"][rule]["s"][def]["rt"]] ){
                 
                    var paramName = GetSymbolizerParamName(__style[uid]["s"][rule]["s"][def]["rt"],p);
                    var paramValue = GetParam(uid,zmin,paramName); ///@todo is this right ... one only zoom can fit this ?
  
                    if ( paramName == "width" ){  
                        $( "<li>" + paramName + " : " +"<input id=\"width_spinner_" + ruleId + "\"></li>").appendTo(ulul);
                        
                        $( "#width_spinner_"+ruleId ).spinner({
                             //change: GetSpinnerCallBack(uid,zmin,zmax,"width"),
                             spin: GetSpinnerCallBack(uid,zmin,zmax,"width"),
                             step: 0.25,
                             min : 0,
                             max : 10,
                        });
                        $( "#width_spinner_"+ruleId ).spinner("value" , paramValue);
                    }
                   
                    else if ( paramName == "fill" ){
                          
                       $("<li>" + paramName + " : " + "<div class=\"colorSelector \" id=\"colorpicker_" + ruleId + "\"><div style=\"background-color:" + RGBAToHex(paramValue) + "\"></div></div> </li>").appendTo(ulul);
                       
                       $("#colorpicker_"+ruleId).ColorPicker({
                          	color: RGBAToHex(paramValue),
                           	onShow: function (colpkr) {
  					                    $(colpkr).fadeIn(500);
  					                    return false;
  		                     },
  				                 onHide: function (colpkr) {
  					                    $(colpkr).fadeOut(500);
  					                    return false;
  				                 },
  				                 onChange: GetColorPickerCallBack(ruleId,uid,zmin,zmax,"fill")
  		                });
                    }
  
                    else if ( paramName == "stroke" ){
  
                       $("<li>" + paramName + " : " + "<div class=\"colorSelector \" id=\"colorpicker_" + ruleId + "\"><div style=\"background-color:" + RGBAToHex(paramValue) + "\"></div></div> </li>").appendTo(ulul);
                       
                       $("#colorpicker_"+ruleId).ColorPicker({
                            color: RGBAToHex(paramValue),
                            onShow: function (colpkr) {
                                    $(colpkr).fadeIn(500);
                                    return false;
                            },
                            onHide: function (colpkr) {
                                    $(colpkr).fadeOut(500);
                                    return false;
                            },
  				                  onChange: GetColorPickerCallBack(ruleId,uid,zmin,zmax,"stroke")
                       });
                    }
 
                    else if ( paramName == "alpha" ){
                        $( "<li>" + paramName + " : " +"<input id=\"alpha_spinner_" + ruleId + "\"></li>").appendTo(ulul);

                        $( "#alpha_spinner_"+ruleId ).spinner({
                             //change: GetSpinnerCallBack(uid,zmin,zmax,"alpha"),
                             spin: GetSpinnerCallBack(uid,zmin,zmax,"alpha"),
                             step: 0.05,
                             min : 0,
                             max : 1,
                        });
                        $( "#alpha_spinner_"+ruleId ).spinner("value" , paramValue);
                    }  
                    else{
                        $("<li>" + paramName + " : " + paramValue + "</li>").appendTo(ulul) ; 
                    }
                 }
              }
           } // end rule loop
        } // end if in group
      } // end uid loop
    } // end group loop

    $( ".mapnifyaccordion" ).accordion({
        heightStyle: "content",
        collapsible: true,
        active: false
    });

    mapnifyParentEl.css('display','block');   //show me !
    // tune the menu div 
    /*
    mapnifyParentEl.dialog({
       title: "Style edition menu :-)",
       position: "left",
       width:'auto',
       height : 650,
       maxHeight : 650,
       resizable: false,
       closeOnEscape: false,
       open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }       
    });
    */
    mapnifyParentEl.draggable();    
//    mapnifyParentEl.animate({left:"80"},1000);
//    mapnifyParentEl.animate({top:"90"},1000);  
//    mapnifyParentEl.css('position','absolute'); 
//    mapnifyParentEl.css('left','0'); 
//    mapnifyParentEl.css('top','0'); 
  }
  
  
  //////////////////////////////////////////////////////////////
  // AJaX load style
  function LoadStyle(){
    console.log("Loading style");
    $.ajax({
       url: serverRootDir+'style/style.jsonz',
       async: false,
       dataType: 'json',
       success: function (data) {
          __style = data;
          __LoadStyle(data);
       }  
    });   
  }
  
  
  //////////////////////////////////////////////////////////////
  // let's go
  Load(); // will call LoadMapping and then LoadStyle ...
    
}// end class MapnifyInitMenu()



