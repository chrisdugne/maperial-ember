//----------------------------------------------------------------------------------------//

//upgrade jquery checkboxes
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

//----------------------------------------------------------------------------------------//

//upgrade Object prototype
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// -------------------------------------------//
//	 	StyleMenu
// -------------------------------------------//

this.StyleMenu = {};

StyleMenu.debug = false;

// -------------------------------------------//

//////////////////////////////////////////////////////////////
// SOME GLOBAL VARS

//StyleMenu.serverRootDirV = "http://192.168.1.19/project/mycarto/wwwClient/";			// local
StyleMenu.serverRootDirV = "http://serv.x-ray.fr/project/mycarto/wwwClient/"; 		// not local ...
StyleMenu.serverRootDirD = "http://map.x-ray.fr/";

// id <-> name/filter mapping
StyleMenu.mappingArray = Array();

// groups of layer (roads, urban, landscape, ...)
StyleMenu.groups = null; 

// the style (json)
StyleMenu.__style = null;   // <<<<=== THIS IS WHAT YOU WANT FOR maps.js and renderTile.js

// the mapping (json)
StyleMenu.mapping = null; // link id (in style) with a "real" name & filter

// current zooms
StyleMenu.activZooms = Array();
StyleMenu.currentZmin = 10;
StyleMenu.currentZmax = 15;

// parent map
StyleMenu.refMap = null;

// parent div
StyleMenu.styleMenuParentEl = null;
StyleMenu.styleMenuParentEl2 = null;
StyleMenu.styleMenuParentEl3 = null;
StyleMenu.mainDiv = null;
StyleMenu.widgetDiv = null;
StyleMenu.zoomDiv = null;

// current element id
StyleMenu.currentUid = null;
StyleMenu.currentGroup = null;
StyleMenu.currentName = null;

///@todo define a xsmall small standard large xlarge size for each element and each zoom level

//////////////////////////////////////////////////////////////
StyleMenu.EventProxy = {};

StyleMenu.EventProxy.lastEvt = null;    //last event treated
StyleMenu.EventProxy.queuedEvt = null;  //last event requested
StyleMenu.EventProxy.eventRate = 3000;
StyleMenu.EventProxy.refreshRate = 100;

StyleMenu.EventProxy.NewEvent = function(){
    var curTime = new Date().getTime(); // ms
    if ( StyleMenu.EventProxy.lastEvt == null){
       StyleMenu.EventProxy.lastEvt = curTime;
       StyleMenu.refMap.GetParams().SetStyle(StyleMenu.__style); 
       try{
          //StyleMenu.refMap.DrawScene(false,true);
       }
       catch(e){};
       return;
    }
    if ( curTime - StyleMenu.EventProxy.lastEvt > StyleMenu.EventProxy.eventRate){
       StyleMenu.EventProxy.lastEvt = curTime;
       StyleMenu.refMap.GetParams().SetStyle(StyleMenu.__style); 
       try{
          //StyleMenu.refMap.DrawScene(false,true);
       }
       catch(e){};
       return;
    }
    StyleMenu.EventProxy.queuedEvt = curTime;
}

window.setInterval(
    function(){
      var curTime = new Date().getTime(); // ms
      if (StyleMenu.EventProxy.queuedEvt == null){
        // no event in queue
        return;
      }
      if ( curTime - StyleMenu.EventProxy.queuedEvt > StyleMenu.EventProxy.eventRate){ // if last event is "old"
        StyleMenu.refMap.GetParams().SetStyle(StyleMenu.__style); 
        //StyleMenu.refMap.DrawScene(false,true);
        StyleMenu.EventProxy.queuedEvt = null;
      }
    },
    StyleMenu.EventProxy.refreshRate);

//////////////////////////////////////////////////////////////
StyleMenu.RuleIdFromDef = function(uid,def){
	// CARE DEPRECATED this one is now FALSE !!! DO NOT USE unless you are very sure of what you are trying to do !!!
	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return null;
	}

	if ( StyleMenu.__style[uid]["s"].length > 0) { // is this can really happend ???
		var rule = 0;
		while ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){       // find the first not-empty symbolizer (for multi-zoom def case)
			rule = rule + 1;
			if ( rule >= Object.size(StyleMenu.__style[uid]["s"]) ){
				if(StyleMenu.debug)console.log("cannot find rule ...", uid, def);
				return null;
			}
		}
		var ruleId = StyleMenu.__style[uid]["s"][rule]["s"][def]["id"];
		return ruleId;
	}
	else{
		return null;
	}
}

//////////////////////////////////////////////////////////////
StyleMenu.DefFromRule = function(uid,rule){
	// CARE DEPRECATED this one is not usefull anymore and will/should return 0

	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	while ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
		def = def + 1;
		if ( def >= Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ){
			if(StyleMenu.debug)console.log("cannot find def ...", uid, rule);
			return -1;
		}
	}
	return def;
}

//////////////////////////////////////////////////////////////
StyleMenu.DefRuleIdFromZoom = function(uid,zoom){
	// CARE DEPRECATED this one will return the good ruleId and will/should return def 0

	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return {"def" : -1, "ruleId" : -1, "rule" : -1};
	}

	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){ // rule
		var zmin = StyleMenu.__style[uid]["s"][rule]["zmin"];
		if ( zmin == zoom ){
			var def = 0;
			while ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
				def = def + 1;
				if ( def >= Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ){
					if(StyleMenu.debug)console.log("cannot find def ...", uid, rule);
					def = -1;
					return {"def" : -1, "ruleId" : -1, "rule" : -1};
				}
			}
			return {"def" : def, "ruleId" : StyleMenu.__style[uid]["s"][rule]["s"][def]["id"], "rule" : rule};
		}
	}
	return {"def" : -1, "ruleId" : -1, "rule" : -1};
}

//////////////////////////////////////////////////////////////
StyleMenu.DefRuleFromZoom = function(uid,zoom){
	// CARE DEPRECATED this one will return the good rule and will/should return def 0

	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return {"def" : -1, "rule" : -1};
	}

	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){ // rule
		var zmin = StyleMenu.__style[uid]["s"][rule]["zmin"];
		if ( zmin == zoom ){
			var def = 0;
			while ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
				def = def + 1;
				if ( def >= Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ){
					if(StyleMenu.debug)console.log("cannot find def ...", uid, rule);
					def = -1;
					return {"def" : -1, "rule" : -1};
				}
			}
			return {"def" : def, "rule" : rule};
		}
	}
	return {"def" : -1, "rule" : -1};
}

//////////////////////////////////////////////////////////////
/*
StyleMenu.DefFromRuleId = function(uid,ruleId){
	// CARE DEPRECATED this one will/should return 0
	if ( StyleMenu.__style[uid] == undefined ){
		//if(StyleMenu.debug)console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){ // rule
		for( var d =0 ; Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
			if( StyleMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){	 // if this is the ruleId we are looking for
				while ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
					def = def + 1;
					if ( def > Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ){
						if(StyleMenu.debug)console.log("cannot find not empty def ...");
						return -1;
					}
				}
				return def;
			}
		}
	}
	return -1;
}
*/
//////////////////////////////////////////////////////////////
StyleMenu.SetParam = function(uid,rule,def,param,value){
	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return false;
	}

	var ok = false;
	for( var p = 0 ; p < Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def] ) ; p++){ // params
    var paramName = Symbolizer.getParamName(StyleMenu.__style[uid]["s"][rule]["s"][def]["rt"],p);
		if ( paramName == param ){
			StyleMenu.__style[uid]["s"][rule]["s"][def][paramName] = value;
			var zmin = StyleMenu.__style[uid]["s"][rule]["zmin"];
			//if(StyleMenu.debug)console.log("changing for z " + zmin);
			ok = true;
			break;
		}
	}
	if ( !ok ){
		//if(StyleMenu.debug)console.log(" not found , adding!" , uid , rule, def , param);
		StyleMenu.__style[uid]["s"][rule]["s"][def][param] = value;
	}
	StyleMenu.EventProxy.NewEvent();
	return ok;
}

//////////////////////////////////////////////////////////////
StyleMenu.SetParamId = function(uid,ruid,param,value){
	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return false;
	}
	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){
		for( var d = 0 ; Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
			if( StyleMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
				for( var p = 0 ; p < Object.size(StyleMenu.__style[uid]["s"][rule]["s"][d] ) ; p++){ //params
          var paramName = Symbolizer.getParamName(StyleMenu.__style[uid]["s"][rule]["s"][d]["rt"],p);
					if ( paramName == param ){
						StyleMenu.__style[uid]["s"][rule]["s"][d][paramName] = value;
						StyleMenu.EventProxy.NewEvent();
						return true;
					}
				}
				//if(StyleMenu.debug)console.log(" not found , adding!" , uid , ruid , param);
				StyleMenu.__style[uid]["s"][rule]["s"][d][param] = value;
				StyleMenu.EventProxy.NewEvent();
				return true;
			}
		}
	}
	if(StyleMenu.debug)console.log(" not found !" , uid , ruid , param);
	return false;
}

//////////////////////////////////////////////////////////////
StyleMenu.SetParamIdZNew = function(uid,param,value){
	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log( uid + " not in style");
		return false;
	}

	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){
		var zmin = StyleMenu.__style[uid]["s"][rule]["zmin"];
		//if(StyleMenu.debug)console.log(zmin);
		//var zmax = StyleMenu.__style[uid]["s"][rule]["zmax"];
		if ( $.inArray(zmin, StyleMenu.activZooms) > -1 ){
			//if(StyleMenu.debug)console.log("zoom is to be changed");
			var def = StyleMenu.DefFromRule(uid,rule);
			if ( def < 0 ){
				continue;
			}
			StyleMenu.SetParam(uid,rule,def,param,value);
		}
	}
	return true;
}

//////////////////////////////////////////////////////////////
StyleMenu.GetParamId = function(uid,ruid,param){
  if ( StyleMenu.__style[uid] == undefined ){
      if(StyleMenu.debug)console.log(uid + " not in style");
      return undefined;
   }
   for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){
      for( var d = 0 ; d < Object.size(StyleMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
         if ( StyleMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
            for ( var p = 0 ; p < Object.size(StyleMenu.__style[uid]["s"][rule]["s"][d] ); p++){ //params
               var paramName = Symbolizer.getParamName(StyleMenu.__style[uid]["s"][rule]["s"][d]["rt"],p);
               if ( paramName == param ){
                   return StyleMenu.__style[uid]["s"][rule]["s"][d][paramName];
               }
            }
            //if(StyleMenu.debug)console.log(" not found , adding!" , uid , ruid , param);
            //StyleMenu.__style[uid]["s"][rule]["s"][d][param] = Symbolizer.default[param];           
            //return StyleMenu.__style[uid]["s"][rule]["s"][d][param]; 
         }
      }
   }
   //if(StyleMenu.debug)console.log(" not found !", uid , ruid, param);
   return undefined;
}

//////////////////////////////////////////////////////////////
StyleMenu.GetZoomSpectra = function(uid,def){
	var zmin = undefined;
	var zmax = undefined;
	if ( StyleMenu.__style[uid] == undefined ){
		if(StyleMenu.debug)console.log(uid + " not in style");
		return {"zmin":zmin,"zmax":zmax};
	}

	for(var rule = 0 ; rule < Object.size(StyleMenu.__style[uid]["s"]) ; rule++){
		if ( Object.size(StyleMenu.__style[uid]["s"][rule]["s"][def]) >= 3 ){
			var zminR = StyleMenu.__style[uid]["s"][rule]["zmin"];
			var zmaxR = StyleMenu.__style[uid]["s"][rule]["zmax"];
			if ( zmin === undefined)
				zmin = zminR;
			if ( zmax === undefined)
				zmax = zmaxR;
			zmin = Math.min(zmin, zminR);
			zmax = Math.max(zmax, zmaxR);
		} 
	}
	return {"zmin":zmin,"zmax":zmax};
}

//////////////////////////////////////////////////////////////
// the main function
StyleMenu.Load = function(){
	StyleMenu.LoadGroup();
}

//////////////////////////////////////////////////////////////
StyleMenu.ReLoad = function(){
    StyleMenu.__LoadStyle();
}

//////////////////////////////////////////////////////////////
// AJaX load group
StyleMenu.LoadGroup = function(){
  if(StyleMenu.debug)console.log("Loading groups");
  $.ajax({
     url: StyleMenu.serverRootDirV+'style/group2.json',
     async: false,
     dataType: 'json',
     //contentType:"application/x-javascript",
     success: function (data) {
        StyleMenu.groups = data;
        StyleMenu.LoadMapping();
     },
     error: function (){
        if(StyleMenu.debug)console.log("Loading group failed");
     }
  });
}

//////////////////////////////////////////////////////////////
StyleMenu.__LoadMapping = function(){
   if(StyleMenu.debug)console.log("##### MAPPING ####");
   for(var entrie = 0 ; entrie < Object.size(StyleMenu.mapping) ; entrie++){
      //if(StyleMenu.debug)console.log(StyleMenu.mapping[entrie]["name"]);
      // build mappingArray object
      for( var layer = 0 ; layer < Object.size(StyleMenu.mapping[entrie]["layers"]) ; layer++){
         //if(StyleMenu.debug)console.log("    filter : " + StyleMenu.mapping[entrie]["layers"][layer]["filter"]);
         //if(StyleMenu.debug)console.log("    uid : " + StyleMenu.mapping[entrie]["layers"][layer]["id"]);
         StyleMenu.mappingArray[ StyleMenu.mapping[entrie]["layers"][layer]["id"] ] = { name : StyleMenu.mapping[entrie]["name"] , filter : StyleMenu.mapping[entrie]["layers"][layer]["filter"]};
      }
   }
   StyleMenu.LoadStyle();  
}

//////////////////////////////////////////////////////////////
StyleMenu.GetUids = function(name){
	var ids = Array();
        if ( name == "none" ){
           return ids;
        }
	for(var entrie = 0 ; entrie < Object.size(StyleMenu.mapping) ; entrie++){
		if ( StyleMenu.mapping[entrie]["name"] == name){
			for( var layer = 0 ; layer < Object.size(StyleMenu.mapping[entrie]["layers"]) ; layer++){
				ids.push(StyleMenu.mapping[entrie]["layers"][layer]["id"]);
			}
		}
	}
	return ids;
}

//////////////////////////////////////////////////////////////
StyleMenu.GetUid = function(name,filter){
	for(var entrie = 0 ; entrie < Object.size(StyleMenu.mapping) ; entrie++){
		if ( StyleMenu.mapping[entrie]["name"] == name){
			for( var layer = 0 ; layer < Object.size(StyleMenu.mapping[entrie]["layers"]) ; layer++){
				if ( StyleMenu.mapping[entrie]["layers"][layer]["filter"] == filter ){
					return StyleMenu.mapping[entrie]["layers"][layer]["id"];
				}
			}
		}
	}
	return null;
}

//////////////////////////////////////////////////////////////
// AJaX load mapping
StyleMenu.LoadMapping = function(){
  if(StyleMenu.debug)console.log("Loading mapping");
  $.ajax({
     url: StyleMenu.serverRootDirV+'style/mapping.json',
     async: false,
     dataType: 'json',
     //contentType:"application/x-javascript",
     success: function (data) {
        StyleMenu.mapping = data;
        StyleMenu.__LoadMapping();
     },
     error: function (){
        if(StyleMenu.debug)console.log("Loading mapping failed");
     }
  });
}

//////////////////////////////////////////////////////////////
// Dirty version ... draw view on the fly ...
StyleMenu.__LoadStyle = function(){

  StyleMenu.styleMenuParentEl.empty();   
  StyleMenu.styleMenuParentEl2.empty();   
  StyleMenu.styleMenuParentEl3.empty();   

  StyleMenu.styleMenuParentEl.hide(); // hide me during loading
  StyleMenu.styleMenuParentEl.css('width','400px'); // force width (avoid scrollbar issue)

  StyleMenu.mainDiv = $("<div id=\"styleMenu_menu_maindiv\"></div>");
  StyleMenu.mainDiv.appendTo(StyleMenu.styleMenuParentEl);

  StyleMenu.widgetDiv = $('<div class="styleMenu_menu_widgetDiv" id="styleMenu_menu_widgetDiv"></div>');
  StyleMenu.widgetDiv.appendTo(StyleMenu.styleMenuParentEl2);

  StyleMenu.zoomDiv = $('<div class="styleMenu_menu_zoomDiv" id="styleMenu_menu_zoomDiv"></div>');
  StyleMenu.zoomDiv.appendTo(StyleMenu.styleMenuParentEl3);

  //StyleMenu.__FillZoomDef();
  StyleMenu.__InsertZoomEdition();
  StyleMenu.__InsertZoomEdition2();
  StyleMenu.__InsertAccordion();
}  

//////////////////////////////////////////////////////////////
StyleMenu.UpdateActivZoom = function(){
	StyleMenu.activZooms = [];
	for ( var z = 1 ; z < 19 ; ++z){
		if ( z == StyleMenu.refMap.GetZoom() ){
			if(StyleMenu.debug)console.log("map zoom is " + z);
			$("#styleMenu_menu_zcheck"+z).button( "option", "label", "Z" + z + "*");
		}
		else{
			$("#styleMenu_menu_zcheck"+z).button( "option", "label", "Z" + z );
		}
		if ( $("#styleMenu_menu_zcheck" + z).is(":checked") ){
			StyleMenu.activZooms.push(z);    
			//$(".styleMenu_menu_symbz"+z).show(); 
		}
		else{
			//$(".styleMenu_menu_symbz"+z).hide();
			//nothing !
		} 
	} 
}

//////////////////////////////////////////////////////////////
StyleMenu.ZoomOut = function(){
	StyleMenu.refMap.ZoomOut();
	StyleMenu.UpdateActivZoom();
	StyleMenu.__BuildWidget(StyleMenu.currentGroup,StyleMenu.currentName,StyleMenu.currentUid);
}

StyleMenu.ZoomIn = function(){
	StyleMenu.refMap.ZoomIn();
	StyleMenu.UpdateActivZoom();
	StyleMenu.__BuildWidget(StyleMenu.currentGroup,StyleMenu.currentName,StyleMenu.currentUid);
}

//////////////////////////////////////////////////////////////
StyleMenu.__InsertZoomEdition = function(){

  $('<button onclick="StyleMenu.ReLoad()"  class="styleMenu_menu_rlbutton" id="styleMenu_menu_rlbutton"  > Reload </button>').appendTo(StyleMenu.zoomDiv).hide();

  $('<button onclick="StyleMenu.ZoomOut()" class="styleMenu_menu_zbutton" id="styleMenu_menu_zbuttonminus" > - </button>').appendTo(StyleMenu.zoomDiv);
  $('<button onclick="StyleMenu.ZoomIn()"  class="styleMenu_menu_zbutton" id="styleMenu_menu_zbuttonplus"  > + </button>').appendTo(StyleMenu.zoomDiv);
  
  $("#styleMenu_menu_rlbutton").button();
  $("#styleMenu_menu_zbuttonminus").button();
  $("#styleMenu_menu_zbuttonplus").button();

}

//////////////////////////////////////////////////////////////
StyleMenu.__InsertZoomEdition2 = function(){

  var tmpcb = '';
  for ( var z = 1 ; z < 19 ; ++z){
      tmpcb += '  <input type="checkbox" class="styleMenu_menu_checkboxz" id="styleMenu_menu_zcheck' + z + '"/><label for="styleMenu_menu_zcheck' + z + '">Z' + z + '</label>';
  }    
  
  $('<h2 class="styleMenu_menu_par_title_z"> Edit some zoom</h2><div id="styleMenu_menu_zoom_selector">' +  tmpcb + '</div>' ).appendTo(StyleMenu.zoomDiv);//.hide();
  $('<h2 class="styleMenu_menu_par_title_z"> Edit a zoom range</h2><div id="styleMenu_menu_sliderrangez"></div><br/>').appendTo(StyleMenu.zoomDiv);

  for ( var z = 1 ; z < 19 ; ++z){
      $("#styleMenu_menu_zcheck"+z).change(function(){
           StyleMenu.UpdateActivZoom();
      });
  }
  
  $( "#styleMenu_menu_zoom_selector" ).buttonset();
  
  $( "#styleMenu_menu_sliderrangez" ).slider({
          range: true,
          min: 1,
          max: 19,
          values: [ StyleMenu.currentZmin, StyleMenu.currentZmax ],
          change: function( event, ui ) {
             var minV = ui.values[0];
             var maxV = ui.values[1];
             StyleMenu.currentZmin = minV;
             StyleMenu.currentZmax = maxV;
             for(var z = 1 ; z < 19 ; ++z){
                if ( z >= minV && z < maxV){
                   $("#styleMenu_menu_zcheck" + z ).check();
                }
                else{
                   $("#styleMenu_menu_zcheck" + z ).uncheck();
                }
                $("#styleMenu_menu_zcheck" + z ).button("refresh");
             }
             StyleMenu.UpdateActivZoom();
          },
          slide: function( event, ui ) {
             if ( (ui.values[0] + 1) > ui.values[1] ) {
                return false;      
             }                      
             var minV = ui.values[0];
             var maxV = ui.values[1];
             StyleMenu.currentZmin = minV;
             StyleMenu.currentZmax = maxV;
             for(var z = 1 ; z < 19 ; ++z){
                if ( z >= minV && z < maxV){
                   $("#styleMenu_menu_zcheck" + z ).check();
                }
                else{
                   $("#styleMenu_menu_zcheck" + z ).uncheck();
                }
                $("#styleMenu_menu_zcheck" + z ).button("refresh");
             }
             StyleMenu.UpdateActivZoom();
          }
  });


  $( "#styleMenu_menu_sliderrangez" ).slider( "values",  [StyleMenu.currentZmin, StyleMenu.currentZmax+1] );  

}

////
// in the next callback "_ruleId" is the *caller* rule id.
// but thanks to SetParamIdZNew we are updating many zooms at the same time
////

//////////////////////////////////////////////////////////////
// Closure for colorpicker callback
StyleMenu.GetColorPickerCallBack = function(_uid,_ruleId,pName){
   return function (hsb, hex, rgb) {
      $("#styleMenu_menu_colorpicker_"+_ruleId +" div").css('backgroundColor', '#' + hex);
      StyleMenu.SetParamIdZNew(_uid,pName,ColorTools.HexToRGBA(hex));
   }
}

//////////////////////////////////////////////////////////////
// Closure for spinner callback
StyleMenu.GetSpinnerCallBack = function(_uid,_ruleId,pName){  
   return function (event, ui) {
      var newV = ui.value;
      StyleMenu.SetParamIdZNew(_uid,pName,newV);
   }
}

//////////////////////////////////////////////////////////////
// Closure for slider callback
StyleMenu.GetSliderCallBack = function(_uid,_ruleId,pName){  
   return function (event, ui) {
      var newV = ui.value;
      StyleMenu.SetParamIdZNew(_uid,pName,newV);
   }
}

//////////////////////////////////////////////////////////////
// Closure for select callback
StyleMenu.GetSelectCallBack = function(_uid,_ruleId,_pName){
  return function (){
      var newV = $("#styleMenu_menu_select_" + _pName + "_" + _ruleId + " option:selected").text();
      StyleMenu.SetParamIdZNew(_uid,_pName,newV);
      ///@todo bug ... seems to work only once ...
  }
}

//////////////////////////////////////////////////////////////
// Closure for checkbox callback
StyleMenu.GetCheckBoxCallBack = function(_uid){
    return function() {
       var vis = $("#styleMenu_menu_check_" + _uid + ":checked").val()?true:false;
       StyleMenu.__style[_uid]["visible"] = vis;               ///@todo this is not in a "set" function ... I don't like that !!!

       var gn = StyleMenu.GetGroupNameFilterFromLayerId(_uid);

       var childs = Array();
       if ( StyleMenu.groups[gn.group][gn.name].type == "line" ){
         var casing = StyleMenu.groups[gn.group][gn.name].casing;
         var center = StyleMenu.groups[gn.group][gn.name].center;
         //if(StyleMenu.debug)console.log(casing,center);
         childs = childs.concat( StyleMenu.GetUids(casing) );
         childs = childs.concat( StyleMenu.GetUids(center) );
       }
       else if (StyleMenu.groups[gn.group][gn.name].type == "poly"){
         childs = childs.concat( StyleMenu.GetUids(StyleMenu.groups[gn.group][gn.name].line) );
       } 
       else{
          ///@todo
       }
       
       for (var i = 0 ; i < childs.length ; i++){
         var uid = childs[i];
         if ( StyleMenu.mappingArray[uid].filter == StyleMenu.mappingArray[_uid].filter ){
            StyleMenu.__style[uid]["visible"] = vis;               ///@todo this is not in a "set" function ... I don't like that !!!
         }
       } 
        
       StyleMenu.EventProxy.NewEvent();     
       //if(StyleMenu.debug)console.log( _uid, "visible",  vis );
    }
}; 

//////////////////////////////////////////////////////////////
StyleMenu.AddColorPicker = function(_paramName,_paramValue,_uid,_ruleId,_container){
   // add to view
   $("<li>" + _paramName + " : " + "<div class=\"colorSelector \" id=\"styleMenu_menu_colorpicker_" + _ruleId + "\"><div style=\"background-color:" + ColorTools.RGBAToHex(_paramValue) + "\"></div></div> </li>").appendTo(_container);
   
   // plug callback
   $("#styleMenu_menu_colorpicker_"+_ruleId).ColorPicker({
      	color: ColorTools.RGBAToHex(_paramValue),   // set initial value
       	onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
       },
       onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
       },
       onChange: StyleMenu.GetColorPickerCallBack(_uid,_ruleId,_paramName)
  });
}

//////////////////////////////////////////////////////////////
StyleMenu.AddSpinner = function(_paramName,_paramValue,_uid,_ruleId,_container,_step,_min,_max){
  // add to view
  $( "<li>" + _paramName + " : " +"<input class=\"styleMenu_menu_spinner\" id=\"styleMenu_menu_spinner_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  
  // set callback
  $( "#styleMenu_menu_spinner_"+_paramName+"_"+_ruleId ).spinner({
       //change: GetSpinnerCallBack(uid,ruleId,_paramName),
       spin: StyleMenu.GetSpinnerCallBack(_uid,_ruleId,_paramName),
       step: _step,
       min : _min,
       max : _max,
  });

  // set initial value    
  $( "#styleMenu_menu_spinner_"+_paramName+"_"+_ruleId ).spinner("value" , _paramValue);  
}

//////////////////////////////////////////////////////////////
StyleMenu.AddSlider = function(_paramName,_paramValue,_uid,_ruleId,_container,_step,_min,_max){
  // add to view
  $( "<li>" + _paramName + " : " +"<div class=\"styleMenu_menu_slider\" id=\"styleMenu_menu_slider_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);

  // set callback
  $( "#styleMenu_menu_slider_"+_paramName+"_"+_ruleId ).slider({
          range: false,
          min: _min,
          max: _max,
          step: _step,
          value: _paramValue,
          change: StyleMenu.GetSliderCallBack(_uid,_ruleId,_paramName),
          slide:  StyleMenu.GetSliderCallBack(_uid,_ruleId,_paramName)
  });

  // set initial value
  $( "#styleMenu_menu_slider_"+_paramName+"_"+_ruleId ).slider("value" , _paramValue);
}

//////////////////////////////////////////////////////////////
StyleMenu.AddCombo = function(_paramName,_paramValue,_uid,_ruleId,_container,_values){
  // add to view
  $( "<li>" + _paramName + " : " +"<select id=\"styleMenu_menu_select_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  // add options
  for( var v = 0 ; v < Object.size(_values) ; v++){
    $("#styleMenu_menu_select_" + _paramName + "_" + _ruleId).append("<option value=\"" + _values[v] + "\"> " + _values[v] + "</option>");
  }
  // set value
  $("#styleMenu_menu_select_" + _paramName + "_" + _ruleId).val(_paramValue);
  // set callback
  $("#styleMenu_menu_select_" + _paramName + "_" + _ruleId).change(StyleMenu.GetSelectCallBack(_uid,_ruleId,_paramName));
}

//////////////////////////////////////////////////////////////
StyleMenu.Accordion = function(_group,_name,uid){
	
  if ( StyleMenu.__style[uid]["s"].length < 1 ){
		if(StyleMenu.debug)console.log("Error : empty style " + uid );
		return;
	}
	
	var groupNum = 0;
  for ( var group in StyleMenu.groups ){ // for all groups of element
    if (!StyleMenu.groups.hasOwnProperty(group)) {
       continue;
    }
    if ( group == _group){
       break;
    }
    groupNum++;
  }
	n = $("#styleMenu_menu_groupaccordion_div_group_"+groupNum+" h2").index($("#styleMenu_menu_headeraccordion_" + uid));
	//console.log($("#styleMenu_menu_groupaccordion_div_group_"+groupNum+" h2"));
	//console.log(n);
	$("#styleMenu_menu_accordion" ).accordion('activate', groupNum);
  $("#styleMenu_menu_groupaccordion_div_group_" + groupNum).accordion('activate', n);
}

//////////////////////////////////////////////////////////////
StyleMenu.FillWidget = function(uid){
	if ( StyleMenu.__style[uid]["s"].length < 1 ){
		if(StyleMenu.debug)console.log("Error : empty style " + uid );
		return;
	}

	if(StyleMenu.debug)console.log("Current zoom is " , StyleMenu.refMap.GetZoom() , uid, def , rule); 

	//var def = 0; // first def is always the good one :-)
	var rd = StyleMenu.DefRuleIdFromZoom(uid,StyleMenu.refMap.GetZoom());
	var def = rd.def;
	var ruleId = rd.ruleId;
	var rule = rd.rule;
	
	if(StyleMenu.debug)console.log("Fill widget for",def,ruleId,rule);
	
	if ( ruleId < 0 ){
     if(StyleMenu.debug)console.log("Cannot find ruleId for zoom " + StyleMenu.refMap.GetZoom());
     return;
    }

	if ( rule < 0 ){
     if(StyleMenu.debug)console.log("Cannot find rule for zoom " + StyleMenu.refMap.GetZoom());
     return;
    }
	
	if ( def < 0 ){
     if(StyleMenu.debug)console.log("Cannot find def for zoom " + StyleMenu.refMap.GetZoom());
     return;
    }
	
	var symbDiv = $('<div></div>');
	symbDiv.appendTo(StyleMenu.widgetDiv);
	
	var ulul = $("<ul></ul>");
	ulul.appendTo(symbDiv);

	for( var p = 0 ; p < Object.size(Symbolizer.params[StyleMenu.__style[uid]["s"][rule]["s"][def]["rt"]] ) ; p++){  // this is read from a list of known params. 

		var paramName = Symbolizer.getParamName(StyleMenu.__style[uid]["s"][rule]["s"][def]["rt"],p);
		var paramValue = StyleMenu.GetParamId(uid,ruleId,paramName);   

		if ( paramValue === undefined ){
			paramValue = Symbolizer.default[paramName];
			//continue;
		}
		//if(StyleMenu.debug)console.log( paramName + " : " + paramValue ) ;

		if ( paramName == "width" ){  
			StyleMenu.AddSlider(paramName,paramValue,uid,ruleId,ulul,0.25,0,20);
		}
		else if ( paramName == "fill" || paramName == "stroke" ){
			StyleMenu.AddColorPicker(paramName,paramValue,uid,ruleId,ulul);
		}
		else if ( paramName == "alpha" ){
			StyleMenu.AddSlider(paramName,paramValue,uid,ruleId,ulul,0.05,0,1);
		}
		else if ( paramName == "linejoin" ){
			StyleMenu.AddCombo(paramName,paramValue,uid,ruleId,ulul,Symbolizer.combos["linejoin"]);
		}  
		else if ( paramName == "linecap" ){
			StyleMenu.AddCombo(paramName,paramValue,uid,ruleId,ulul,Symbolizer.combos["linecap"]);
		}  
		else{
			$("<li>" + paramName + "(not implemented yet) : " + paramValue + "</li>").appendTo(ulul) ; 
		}
	}
}

//////////////////////////////////////////////////////////////
StyleMenu.__BuildWidget = function(group,name,uid){
  
   if(StyleMenu.debug)console.log("building widget ",group,name,uid);
 
   //clear parent div
   StyleMenu.widgetDiv.empty();

   StyleMenu.currentUid = uid;
   StyleMenu.currentGroup = group;
   StyleMenu.currentName = name;
   
   if ( StyleMenu.__style[uid] == undefined ){
      if(StyleMenu.debug)console.log( uid + " not in style");
      return;
   }

   $("<h2 class=\"styleMenu_menu_par_title\">" + StyleMenu.mappingArray[uid].name + "</h2>").appendTo(StyleMenu.widgetDiv);
   if ( StyleMenu.mappingArray[uid].filter != "" && StyleMenu.GetUids(name).length > 1){
      $("<p class=\"styleMenu_menu_filter_title\">(" + StyleMenu.mappingArray[uid].filter + ")</p>").appendTo(StyleMenu.widgetDiv);
   }

   if( StyleMenu.groups[group][StyleMenu.mappingArray[uid].name].type == "line" ){
      //if(StyleMenu.debug)console.log("I'm a line !");
      
      StyleMenu.FillWidget(uid);
      
      var casing = StyleMenu.groups[group][StyleMenu.mappingArray[uid].name].casing;
      var center = StyleMenu.groups[group][StyleMenu.mappingArray[uid].name].center;
      var casing_uid = StyleMenu.GetUid(casing,StyleMenu.mappingArray[uid].filter);
      var center_uid = StyleMenu.GetUid(center,StyleMenu.mappingArray[uid].filter);

      if ( casing_uid == null){
          //if(StyleMenu.debug)console.log("casing not found : " + casing);
      }
      else{
          //if(StyleMenu.debug)console.log("casing found : " + casing);
          $('<h2 class="styleMenu_menu_par_title">casing </h2>').appendTo(StyleMenu.widgetDiv);
          StyleMenu.FillWidget(casing_uid);
      }

      if ( center_uid == null){
          //if(StyleMenu.debug)console.log("center not found : " + center);
      }
      else{
          //if(StyleMenu.debug)console.log("center found : " + center);
          $('<h2 class="styleMenu_menu_par_title">center line </h2>').appendTo(StyleMenu.widgetDiv);
          StyleMenu.FillWidget(center_uid);
      }                      
   }
   else if( StyleMenu.groups[group][StyleMenu.mappingArray[uid].name].type == "poly" ){
      //if(StyleMenu.debug)console.log("I'm a poly !");
	  
      StyleMenu.FillWidget(uid);	  
	  
      var border = StyleMenu.groups[group][StyleMenu.mappingArray[uid].name].line;
      var border_uid = StyleMenu.GetUid(border,StyleMenu.mappingArray[uid].filter);
      
      if ( border_uid == null){
          //if(StyleMenu.debug)console.log("border not found : " + border);
      }
      else{
          //if(StyleMenu.debug)console.log("border found : " + border);
		      ///@todo
      }      
   }
   else{
      ///@todo
   }

   StyleMenu.UpdateActivZoom();
}

//////////////////////////////////////////////////////////////
StyleMenu.GetWidgetCallBack = function(group,name,uid){
    return function(){
      //if(StyleMenu.debug)console.log(uid + " clicked");
      StyleMenu.__BuildWidget(group,name,uid);
    } 
}

//////////////////////////////////////////////////////////////
StyleMenu.GetGroupNameFilterFromLayerId = function(uid){
 for ( var group in StyleMenu.groups ){ // for all groups of element
    if (!StyleMenu.groups.hasOwnProperty(group)) {
     continue;
    }
    for ( var name in StyleMenu.groups[group] ){    // for elements in group
         if (!StyleMenu.groups[group].hasOwnProperty(name)) {
            continue;
         }
         var uids = StyleMenu.GetUids(name);
         var childs = Array();
         if ( StyleMenu.groups[group][name].type == "line" ){
            var casing = StyleMenu.groups[group][name].casing;
            var center = StyleMenu.groups[group][name].center;
            //if(StyleMenu.debug)console.log(casing,center);
            childs = childs.concat( StyleMenu.GetUids(casing) );
            childs = childs.concat( StyleMenu.GetUids(center) );
         }
         else if (StyleMenu.groups[group][name].type == "poly"){
            childs = childs.concat( StyleMenu.GetUids(StyleMenu.groups[group][name].line) );
         } 
         else{
            ///@todo
         }
         //if(StyleMenu.debug)console.log(group,name,uids);
         if ( uids.length == 0 ){
             continue;
         }
         // primary object case
         for (var i = 0 ; i < uids.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var _uid = uids[i];
           if ( uid == _uid ){
              return {"group": group,"name": name, "filter": StyleMenu.mappingArray[uid].filter, "uid": uid};
           }  
         }
         // child case
         for (var i = 0 ; i < childs.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var _uid = childs[i];
           if ( uid == _uid ){
              // lets find parent id
              for(var k = 0 ; k < uids.length ; ++k){
                 if ( StyleMenu.mappingArray[uids[k]].filter == StyleMenu.mappingArray[_uid].filter ){
                    return {"group": group,"name": name, "filter": StyleMenu.mappingArray[uid].filter, "uid": uids[k]};
                 }
              }
           }  
         }
    }
 }
 return {"group": null, "name": null, "filter": null, "uid": null};
}

//////////////////////////////////////////////////////////////
StyleMenu.__InsertAccordion = function(){

  $("#styleMenu_menu_accordion").remove();

  var outterAcc = $("<div class=\"styleMenu_menu_accordion\" id=\"styleMenu_menu_accordion\"></div>");
  outterAcc.appendTo(StyleMenu.mainDiv);

  var groupNum = 0;

  for ( var group in StyleMenu.groups ){ // for all groups of element
    if (!StyleMenu.groups.hasOwnProperty(group)) {
     continue;
    }
    if(StyleMenu.debug)console.log(group);

    $("<h1 id=\"styleMenu_menu_groupaccordion_head_group_" + groupNum + "\"> Group : " + group + "</h1>").appendTo(outterAcc);
    var groupAcc = $("<div class=\"styleMenu_menu_accordion\" id=\"styleMenu_menu_groupaccordion_div_group_" + groupNum +  "\"></div>");
    groupAcc.appendTo(outterAcc);

    groupNum++;

    for ( var name in StyleMenu.groups[group] ){    // for elements in group
         if (!StyleMenu.groups[group].hasOwnProperty(name)) {
            continue;
         }
         if(StyleMenu.debug)console.log("found ! : " + name );
         
         var uids = StyleMenu.GetUids(name);
         
         if ( uids.length == 0 ){
             if(StyleMenu.debug)console.log("Warning : no uid found for " + name, group);
             continue;
         }
         
         //if(StyleMenu.debug)console.log("Found " + uids.length + " ids for " + name, group);
         
         for (var i = 0 ; i < uids.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var uid = uids[i];
           //if(StyleMenu.debug)console.log(uid);
           // make header
           $('<h2 id="styleMenu_menu_headeraccordion_' + uid + '">' + StyleMenu.mappingArray[uid].name + "</h2>").appendTo(groupAcc);
           // bind onclick header event!
           $("#styleMenu_menu_headeraccordion_"+uid).bind('click',StyleMenu.GetWidgetCallBack(group,name,uid));
           // fill inner div with some info
           var divIn = $("<div class=\"inner\" id=\"divinner_" + groupNum + "_" + uid + "\"></div>");
           divIn.appendTo(groupAcc);
           
           $("<strong>Properties :<strong>").appendTo(divIn);
           var ul = $("<ul></ul>");
           ul.appendTo(divIn);
                    
           $("<li>" + "Filter : " + StyleMenu.mappingArray[uid].filter + "</li>").appendTo(ul);
           $("<li>" + "Visible  : " + "<input type=\"checkbox\" id=\"styleMenu_menu_check_" + uid + "\" />" + "</li>").appendTo(ul);
           $("#styleMenu_menu_check_" + uid).click( StyleMenu.GetCheckBoxCallBack(uid) );
           $("#styleMenu_menu_check_" + uid).attr('checked', StyleMenu.__style[uid]["visible"]);
           $("<li>" + "Place : " + StyleMenu.__style[uid]["layer"] + "</li>").appendTo(ul);

         } // end uid loop
    } // end name loop
  } // end group loop

  
  // fill an empty widget window ("zzz" does not exist !)
  StyleMenu.__BuildWidget("xxx","yyy","zzz");
  
  StyleMenu.UpdateActivZoom();

  // configure accordion(s)
  $( ".styleMenu_menu_accordion" )
  .accordion({
      heightStyle: "content",
      collapsible: true,
      active: false
  })

  StyleMenu.styleMenuParentEl.show();   //show me !
}

//////////////////////////////////////////////////////////////
// AJaX load style
StyleMenu.LoadStyle = function(){
  if(StyleMenu.debug)console.log("Loading style");
  if ( StyleMenu.__style === undefined ){
    if(StyleMenu.debug)console.log("Style not defined ... reading default");
    $.ajax({
      url: StyleMenu.serverRootDirV+'style/style.json',
      //url: 'http://map.x-ray.fr/api/style/1_style_13ba851b4e18833e08e',
      async: false,
      dataType: 'json',
      //contentType:"application/x-javascript",
      success: function (data) {
          StyleMenu.__style = data;
          StyleMenu.__LoadStyle();
      },
      error: function (){
        if(StyleMenu.debug)console.log("Loading style failed");
      }  
    });
   }
   else{
      StyleMenu.__LoadStyle();
   }
   StyleMenu.refMap.GetParams().SetStyle(StyleMenu.__style); 
   try{
      //StyleMenu.refMap.DrawScene(false,true);
   }
  catch(e){};
}
  

StyleMenu.SetStyle = function (style){
   StyleMenu.__style = style;
   StyleMenu.Load(); // will call LoadMapping and then LoadStyle ...
}
 
//////////////////////////////////////////////////////////
//  init !
//////////////////////////////////////////////////////////
StyleMenu.init = function(container,container2,container3,isMovable,maps,style){
  StyleMenu.styleMenuParentEl = container;
  StyleMenu.styleMenuParentEl2 = container2;
  StyleMenu.styleMenuParentEl3 = container3;
  StyleMenu.__style = style;
  StyleMenu.refMap = maps;
  StyleMenu.Load(); // will call LoadMapping and then LoadStyle ...
  if ( isMovable){
      StyleMenu.styleMenuParentEl.draggable();    
      StyleMenu.styleMenuParentEl2.draggable();    
      StyleMenu.styleMenuParentEl3.draggable();    
  }
}// end class StyleMenu.init



