//////////////////////////////////////////////////////////////
// SOME GLOBAL VARS

var serverRootDirV = "http://192.168.1.19/project/mycarto/wwwClient/";			// local
//var serverRootDirV = "http://serv.x-ray.fr/project/mycarto/wwwClient/"; 		// not local ...
var serverRootDirD = "http://map.x-ray.fr/";

// id <-> name/filter mapping
var mappingArray = Array();

// groups of layer (roads, urban, landscape, ...)
var groups = null; 

// the style (json)
var __style = null;   // <<<<=== THIS IS WHAT YOU WANT FOR maps.js and renderTile.js

// the mapping (json)
var mapping = null; // link id (in style) with a "real" name & filter

// current zooms
var activZooms = Array();

//////////////////////////////////////////////////////////////
// set param = value for layer uid at zoom
///@todo check that zoom issue min/max can overlap ??? 
///@todo check that zoom issue repeted zoom !!
/*
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
*/

function SetParamId(uid,ruid,param,value){
   if ( __style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
      for( var d in __style[uid]["s"][rule]["s"]){ //def
         if( __style[uid]["s"][rule]["s"][d]["id"] == ruid ){
            for( var p in __style[uid]["s"][rule]["s"][d] ){ // params
               if ( p == param ){
                  __style[uid]["s"][rule]["s"][d][p] = value;
                  return true;
               }
            }
            //console.log(" not found , adding!" , uid , ruid , param);
            __style[uid]["s"][rule]["s"][d][param] = value;
            return true;            
         }
      }
   }
   //console.log(" not found !" , uid , ruid , param);
   return false;
}

function SetParamIdZ(uid,ruid,param,value,zooms){
   if ( __style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }
   
   var def = null;
   var stop = false;
   //get the good def..
   for(var rule in __style[uid]["s"]){
      var zmin = __style[uid]["s"][rule]["zmin"];
      //var zmax = __style[uid]["s"][rule]["zmax"];
      for( var d in __style[uid]["s"][rule]["s"]){ //def
           if( __style[uid]["s"][rule]["s"][d]["id"] == ruid ){
              def = d;
              console.log("found def : " + def);
              stop = true;
              break;
           }
      }
      if( stop ){
          break;
      }
   }
   
   if ( def == null ){
      console.log("def not found for " + ruid , uid);
      return;
   }
   
   console.log(activZooms);
   
   for(var rule in __style[uid]["s"]){
      var zmin = __style[uid]["s"][rule]["zmin"];
      //var zmax = __style[uid]["s"][rule]["zmax"];
      if ( $.inArray(zmin, activZooms) > -1 ){ 
         console.log("changing for z " + zmin);
         __style[uid]["s"][rule]["s"][def][param] = value;
      }
   }
   //console.log(" not found !" , uid , ruid , param);
   return false;
}

//////////////////////////////////////////////////////////////
// get param for layer uid at zoom 
///@todo check that zoom issue min/max can overlap ???
///@todo check that zoom issue repeted zoom !! 
/*
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
*/

function GetParamId(uid,ruid,param){
  if ( __style[uid] == undefined ){
      console.log(uid + " not in style");
      return;
   }
   for(var rule in __style[uid]["s"]){
      for( var d in __style[uid]["s"][rule]["s"]){ //def
         if ( __style[uid]["s"][rule]["s"][d]["id"] == ruid ){
            for ( var p in __style[uid]["s"][rule]["s"][d] ){ // params
               if ( p == param ){
                   return __style[uid]["s"][rule]["s"][d][p];
               }
            }
         }
      }
   }
   //console.log(" not found !", uid , ruid, param);
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
function GetColorPickerCallBack(_uid,_ruleId,pName){
   return function (hsb, hex, rgb) {
      $("#colorpicker_"+_ruleId +" div").css('backgroundColor', '#' + hex);
      //SetParamId(_uid,_ruleId,pName,HexToRGBA(hex));
      console.log(activZooms);
      SetParamIdZ(_uid,_ruleId,pName,HexToRGBA(hex));
      //console.log("changed value : " + GetParamId(_uid,_ruleId,pName) , _uid, _ruleId);
   }
}

//////////////////////////////////////////////////////////////
// Closure for spinner callback
function GetSpinnerCallBack(_uid,_ruleId,pName){  
   return function (event, ui) {
      var newV = ui.value;
      //SetParamId(_uid,_ruleId,pName,newV);
      SetParamIdZ(_uid,_ruleId,pName,newV);
      //console.log("changed value : " + GetParamId(_uid,_ruleId,pName) , _uid, _ruleId);
   }
}
  
//////////////////////////////////////////////////////////////
// Closure for checkbox callback
function GetCheckBoxCallBack(_uid){
    return function() {
       var vis = $("#check_" + _uid + ":checked").val()?true:false;
       __style[_uid]["visible"] = vis; 
       //console.log( _uid, "visible",  vis );
    }
};   
      
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// the menu class ...  
function MapnifyInitMenu(container,isMovable){

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
       url: serverRootDirV+'style/group.json',
       async: false,
       dataType: 'json',
       //contentType:"application/x-javascript",
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
           //console.log("    filter : " + mapping[entrie]["layers"][layer]["filter"]);
           //console.log("    uid : " + mapping[entrie]["layers"][layer]["id"]);
           mappingArray[ mapping[entrie]["layers"][layer]["id"] ] = { name : mapping[entrie]["name"] , filter : mapping[entrie]["layers"][layer]["filter"]};
        }
     }
     LoadStyle();  
  }

  //////////////////////////////////////////////////////////////
  // AJaX load mapping
  function LoadMapping(){
    console.log("Loading mapping");
    $.ajax({
       url: serverRootDirV+'style/mapping.json',
       async: false,
       dataType: 'json',
       //contentType:"application/x-javascript",
       success: function (data) {
          mapping = data;
          __LoadMapping(data);
       }
    });
  }
 
  (function($)  {
     $.fn.extend({
        check : function()  {
           return this.filter(":radio, :checkbox").attr("checked", true);
        },
        uncheck : function()  {
           return this.filter(":radio, :checkbox").removeAttr("checked");
        }
     });
  }(jQuery));

 
  // Dirty version ... draw view on the fly ...
  function __LoadStyle(data){
  
    mapnifyParentEl.empty();   
  
    mapnifyParentEl.css('display','none'); // hide me during loading
    mapnifyParentEl.css('width','400px'); // force width (avoid scrollbar issue)
  
    var mainDiv = $("<div id=\"mapnify_menu_div\"</div>");
    mainDiv.appendTo(mapnifyParentEl);
  
    __FillZoomDef();
    __InsertZoomEdition(mainDiv);
    __InsertAccordion(mainDiv);
  }  

  function UpdateActivZoom(){
     activZooms = [];
     for ( var z = 1 ; z < 19 ; ++z){
        if ( $("#zcheck" + z).is(":checked") ){
           //console.log(z + "is checked");
           activZooms.push(z);     
        }
        else{
           //nothing !
        }     
     } 
  }
    
  function __InsertZoomEdition(_mainDiv){
    var tmpcb = '';
    for ( var z = 1 ; z < 19 ; ++z){
        tmpcb += '  <input type="checkbox" class="checkboxz" id="zcheck' + z + '"/><label for="zcheck' + z + '">Z' + z + '</label>';
        //if ( z % 6 == 0){
        //   tmpcb += '<br>';
        //}
    }    
 
    
    $('<h2> Edit some zoom</h2><div id="zoom_selector">' +  tmpcb + '</div><br/>' ).appendTo(_mainDiv);
    $('<h2> Edit a range of zoom</h2><div id="sliderrangez"></div><br/>').appendTo(_mainDiv);
  
    $( "#zoom_selector" ).buttonset();

    for ( var z = 1 ; z < 19 ; ++z){
        $("#zcheck"+z).change(function(){
	     /*
             for ( var k = 1 ; k < 19 ; ++k){             
                if ( k != z ){
                   $("#zcheck"+k).uncheck();
                   $("#zcheck"+k ).button("refresh");
                }               
             } 
             */
             //alert("clicked");
             UpdateActivZoom();
             //__InsertAccordion(_mainDiv);
        });
    }
    
    $( "#sliderrangez" ).slider({
            range: true,
            min: 0,
            max: 18,
            values: [ 10, 15 ],
            change: function( event, ui ) {
               var minV = ui.values[0];
               var maxV = ui.values[1];
               //console.log(minV,maxV);
               for(var z = 1 ; z < 19 ; ++z){
                  if ( z >= minV && z <= maxV){
                     $("#zcheck" + z ).check();
                  }
                  else{
                     $("#zcheck" + z ).uncheck();
                  }
                  $("#zcheck" + z ).button("refresh");
               }
               UpdateActivZoom();
               //__InsertAccordion(_mainDiv);
            }
    });
 
    $( "#sliderrangez" ).slider( "values",  [10, 15] );  
  
  }

  var idsFromZoom = {};
  var zoomFromId = {};

  function __FillZoomDef(mainDiv){
     for ( var group in groups ){
      //console.log(groups[group]);
      for ( var uid in __style ){
         //console.log(group,uid, mappingArray[uid].name);
         if ( $.inArray(mappingArray[uid].name,groups[group]) >= 0) {
           //console.log("found ! : " + mappingArray[uid].name );
           var ruleNum = 0;
           for( var rule in __style[uid]["s"] ){
              var zmin = __style[uid]["s"][rule]["zmin"];
              //var zmax = __style[uid]["s"][rule]["zmax"];
              ///@todo this is a test considering zmin = zmax
              for ( var def in __style[uid]["s"][rule]["s"] ){
                  var ruleId = __style[uid]["s"][rule]["s"][def]["id"];
                  zoomFromId[ruleId] = zmin;
                  
                  if ( idsFromZoom[zmin] == undefined ){
                      idsFromZoom[zmin] = Array();
                  }
                  idsFromZoom[zmin].push(ruleId);
              }
           } // end rule loop
        } // end if in group
      } // end uid loop
    } // end group loop
    console.log(zoomFromId);
    console.log(idsFromZoom);
  }


  // note that ruleId is uniq (for each symbolizer ...)

  function AddColorPicker(_paramName,_paramValue,_uid,_ruleId,_container){
     // add to view
     $("<li>" + _paramName + " : " + "<div class=\"colorSelector \" id=\"colorpicker_" + _ruleId + "\"><div style=\"background-color:" + RGBAToHex(_paramValue) + "\"></div></div> </li>").appendTo(_container);
     
     // plug callback
     $("#colorpicker_"+_ruleId).ColorPicker({
        	color: RGBAToHex(_paramValue),   // set initial value
         	onShow: function (colpkr) {
              $(colpkr).fadeIn(500);
              return false;
         },
         onHide: function (colpkr) {
              $(colpkr).fadeOut(500);
              return false;
         },
         onChange: GetColorPickerCallBack(_uid,_ruleId,_paramName)
    });
  }

  function AddSpinner(_paramName,_paramValue,_uid,_ruleId,_container,_step,_min,_max){
    // add to view
    $( "<li>" + _paramName + " : " +"<input id=\"spinner_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
    
    // set callback
    $( "#spinner_"+_paramName+"_"+_ruleId ).spinner({
         //change: GetSpinnerCallBack(uid,ruleId,_paramName),
         spin: GetSpinnerCallBack(_uid,_ruleId,_paramName),
         step: _step,
         min : _min,
         max : _max,
    });

    // set initial value    
    $( "#spinner_"+_paramName+"_"+_ruleId ).spinner("value" , _paramValue);  
  }

  function __InsertAccordion(mainDiv){

    $("#mapnifyaccordion").remove();

    var outterAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifyaccordion\"></div>");
    outterAcc.appendTo(mainDiv);

    var groupNum = 0;

    for ( var group in groups ){

      console.log(group);

      $("<h1 id=\"mapnifygroupaccordion_head_group_" + groupNum + "\"> Group : " + group + "</h1>").appendTo(outterAcc);
      var groupAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifygroupaccordion_div_group_" + groupNum +  "\"></div>");
      groupAcc.appendTo(outterAcc);

      groupNum++;

      for ( var uid in __style ){

         //console.log(group,uid, mappingArray[uid].name);

         if ( $.inArray(mappingArray[uid].name,groups[group]) >= 0) {

           //console.log("found ! : " + mappingArray[uid].name );

           $("<h2>" + mappingArray[uid].name + "</h2>").appendTo(groupAcc);
           var divIn = $("<div class=\"inner\" id=\"divinner_" + groupNum + "_" + uid + "\"></div>");
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
  
           /*
           var innerAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifyaccordion_"+uid + "\">");
           innerAcc.appendTo(divIn);
           */
           /*
           var ruleNum = 0;
           */
           /*
           for( var rule in __style[uid]["s"] ){
           */
           if ( __style[uid]["s"].length > 0) {
              var rule = 0;
  
              /*
              var zmin = __style[uid]["s"][rule]["zmin"];
              var zmax = __style[uid]["s"][rule]["zmax"];
              */
              
              /*
              if ( ! $("#zcheck" + zmin).is(":checked") ){
                  continue;
              }
              */
              /*
              if ( zmin != zmax ){
                 $("<h3 id=\"h_rule_" + uid + "_" + ruleNum + "\"" + ">Zoom " + zmin + " to " + zmax + "</h3>").appendTo(innerAcc);
              }
              else{
                 $("<h3 id=\"h_rule_" + uid + "_" + ruleNum + "\"" + ">Zoom " + zmin + "</h3>").appendTo(innerAcc);
              }
              var divInIn = $("<div id=\"d_rule_" + uid + "_" + ruleNum + "\" class=\"inner\" " + "></div>");
              divInIn.appendTo(innerAcc);
  
              ruleNum++;
              */
              
              for ( var def in __style[uid]["s"][rule]["s"] ){       // a rule (in the sens of zoom can have multiple def in the sens of symbolizer ...)
                 $("<strong>" + __style[uid]["s"][rule]["s"][def]["rt"] + "</strong>").appendTo(divIn/*In*/);
                 var ulul = $("<ul></ul>");
                 ulul.appendTo(divIn/*In*/);

                 var ruleId = __style[uid]["s"][rule]["s"][def]["id"];//generateGuid();    
                        
                 for( var p in SymbolizerParams[__style[uid]["s"][rule]["s"][def]["rt"]] ){  // this is read from a list of known params. 
                 
                    var paramName = GetSymbolizerParamName(__style[uid]["s"][rule]["s"][def]["rt"],p);
                    var paramValue = GetParamId(uid,ruleId,paramName);
                    //console.log( paramName + " : " + paramValue ) ;
                     
                    if ( paramName == "width" ){  
                        AddSpinner(paramName,paramValue,uid,ruleId,ulul,0.25,0,10);
                    }
                    else if ( paramName == "fill" || paramName == "stroke" ){
                        AddColorPicker(paramName,paramValue,uid,ruleId,ulul);
                    }
                    else if ( paramName == "alpha" ){
                        AddSpinner(paramName,paramValue,uid,ruleId,ulul,0.05,0,1);
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

    if ( isMovable){
        mapnifyParentEl.draggable();    
    }
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
       url: serverRootDirV+'style/style.json',
       async: false,
       dataType: 'json',
       //contentType:"application/x-javascript",
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



