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
//	 	MapnifyMenu
// -------------------------------------------//

this.MapnifyMenu = {};

// -------------------------------------------//

//////////////////////////////////////////////////////////////
// SOME GLOBAL VARS

//MapnifyMenu.serverRootDirV = "http://192.168.1.19/project/mycarto/wwwClient/";			// local
MapnifyMenu.serverRootDirV = "http://serv.x-ray.fr/project/mycarto/wwwClient/"; 		// not local ...
MapnifyMenu.serverRootDirD = "http://map.x-ray.fr/";

// id <-> name/filter mapping
MapnifyMenu.mappingArray = Array();

// groups of layer (roads, urban, landscape, ...)
MapnifyMenu.groups = null; 

// the style (json)
MapnifyMenu.__style = null;   // <<<<=== THIS IS WHAT YOU WANT FOR maps.js and renderTile.js

// the mapping (json)
MapnifyMenu.mapping = null; // link id (in style) with a "real" name & filter

// current zooms
MapnifyMenu.activZooms = Array();
MapnifyMenu.currentZmin = 10;
MapnifyMenu.currentZmax = 15;

// parent map
MapnifyMenu.refMap = null;

// parent div
MapnifyMenu.mapnifyParentEl = null;
MapnifyMenu.mapnifyParentEl2 = null;
MapnifyMenu.mainDiv = null;
MapnifyMenu.widgetDiv = null;

// current element id
MapnifyMenu.currentUid = null;
MapnifyMenu.currentGroup = null;
MapnifyMenu.currentName = null;

///@todo define a xsmall small standard large xlarge size for each element and each zoom level

//////////////////////////////////////////////////////////////
MapnifyMenu.EventProxy = {};

MapnifyMenu.EventProxy.lastEvt = null;    //last event treated
MapnifyMenu.EventProxy.queuedEvt = null;  //last event requested
MapnifyMenu.EventProxy.eventRate = 3000;
MapnifyMenu.EventProxy.refreshRate = 100;

MapnifyMenu.EventProxy.NewEvent = function(){
    var curTime = new Date().getTime(); // ms
    if ( MapnifyMenu.EventProxy.lastEvt == null){
       MapnifyMenu.EventProxy.lastEvt = curTime;
       TileRenderer.SetStyle(MapnifyMenu.__style); // TileRenderer.js MUST BE LOADED
       MapnifyMenu.refMap.DrawScene(false,true);
       return;
    }
    if ( curTime - MapnifyMenu.EventProxy.lastEvt > MapnifyMenu.EventProxy.eventRate){
       MapnifyMenu.EventProxy.lastEvt = curTime;
       TileRenderer.SetStyle(MapnifyMenu.__style); // TileRenderer.js MUST BE LOADED
       MapnifyMenu.refMap.DrawScene(false,true);
       return;
    }
    MapnifyMenu.EventProxy.queuedEvt = curTime;
}

window.setInterval(
    function(){
      var curTime = new Date().getTime(); // ms
      if (MapnifyMenu.EventProxy.queuedEvt == null){
        // no event in queue
        return;
      }
      if ( curTime - MapnifyMenu.EventProxy.queuedEvt > MapnifyMenu.EventProxy.eventRate){ // if last event is "old"
        TileRenderer.SetStyle(MapnifyMenu.__style); // TileRenderer.js MUST BE LOADED
        MapnifyMenu.refMap.DrawScene(false,true);
        MapnifyMenu.EventProxy.queuedEvt = null;
      }
    },
    MapnifyMenu.EventProxy.refreshRate);

//////////////////////////////////////////////////////////////
MapnifyMenu.RuleIdFromDef = function(uid,def){
	// CARE DEPRECATED this one is now FALSE !!! DO NOT USE unless you are very sure of what you are trying to do !!!
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return null;
	}

	if ( MapnifyMenu.__style[uid]["s"].length > 0) { // is this can really happend ???
		var rule = 0;
		while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){       // find the first not-empty symbolizer (for multi-zoom def case)
			rule = rule + 1;
			if ( rule >= Object.size(MapnifyMenu.__style[uid]["s"]) ){
				console.log("cannot find rule ...", uid, def);
				return null;
			}
		}
		var ruleId = MapnifyMenu.__style[uid]["s"][rule]["s"][def]["id"];
		return ruleId;
	}
	else{
		return null;
	}
}

//////////////////////////////////////////////////////////////
MapnifyMenu.DefFromRule = function(uid,rule){
	// CARE DEPRECATED this one is not usefull anymore and will/should return 0

	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
		def = def + 1;
		if ( def >= Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
			console.log("cannot find def ...", uid, rule);
			return -1;
		}
	}
	return def;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.DefRuleIdFromZoom = function(uid,zoom){
	// CARE DEPRECATED this one will return the good ruleId and will/should return def 0

	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return {"def" : -1, "ruleId" : -1, "rule" : -1};
	}

	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){ // rule
		var zmin = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
		if ( zmin == zoom ){
			var def = 0;
			while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
				def = def + 1;
				if ( def >= Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
					console.log("cannot find def ...", uid, rule);
					def = -1;
					return {"def" : -1, "ruleId" : -1, "rule" : -1};
				}
			}
			return {"def" : def, "ruleId" : MapnifyMenu.__style[uid]["s"][rule]["s"][def]["id"], "rule" : rule};
		}
	}
	return {"def" : -1, "ruleId" : -1, "rule" : -1};
}

//////////////////////////////////////////////////////////////
MapnifyMenu.DefRuleFromZoom = function(uid,zoom){
	// CARE DEPRECATED this one will return the good rule and will/should return def 0

	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return {"def" : -1, "rule" : -1};
	}

	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){ // rule
		var zmin = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
		if ( zmin == zoom ){
			var def = 0;
			while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
				def = def + 1;
				if ( def >= Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
					console.log("cannot find def ...", uid, rule);
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
MapnifyMenu.DefFromRuleId = function(uid,ruleId){
	// CARE DEPRECATED this one will/should return 0
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){ // rule
		for( var d =0 ; Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
			if( MapnifyMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){	 // if this is the ruleId we are looking for
				while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
					def = def + 1;
					if ( def > Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
						console.log("cannot find not empty def ...");
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
MapnifyMenu.SetParam = function(uid,rule,def,param,value){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return false;
	}

	var ok = false;
	for( var p = 0 ; p < Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def] ) ; p++){ // params
    var paramName = Symbolizer.getParamName(MapnifyMenu.__style[uid]["s"][rule]["s"][def]["rt"],p);
		if ( paramName == param ){
			MapnifyMenu.__style[uid]["s"][rule]["s"][def][paramName] = value;
			var zmin = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
			console.log("changing for z " + zmin);
			ok = true;
			break;
		}
	}
	if ( !ok ){
		console.log(" not found , adding!" , uid , rule, def , param);
		MapnifyMenu.__style[uid]["s"][rule]["s"][def][param] = value;
	}
	MapnifyMenu.EventProxy.NewEvent();
	return ok;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.SetParamId = function(uid,ruid,param,value){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return false;
	}
	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){
		for( var d = 0 ; Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
			if( MapnifyMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
				for( var p = 0 ; p < Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][d] ) ; p++){ //params
          var paramName = Symbolizer.getParamName(MapnifyMenu.__style[uid]["s"][rule]["s"][d]["rt"],p);
					if ( paramName == param ){
						MapnifyMenu.__style[uid]["s"][rule]["s"][d][paramName] = value;
						MapnifyMenu.EventProxy.NewEvent();
						return true;
					}
				}
				//console.log(" not found , adding!" , uid , ruid , param);
				MapnifyMenu.__style[uid]["s"][rule]["s"][d][param] = value;
				MapnifyMenu.EventProxy.NewEvent();
				return true;
			}
		}
	}
	console.log(" not found !" , uid , ruid , param);
	return false;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.SetParamIdZNew = function(uid,param,value){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return false;
	}

	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){
		var zmin = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
		console.log(zmin);
		//var zmax = MapnifyMenu.__style[uid]["s"][rule]["zmax"];
		if ( $.inArray(zmin, MapnifyMenu.activZooms) > -1 ){
			console.log("zoom is to be changed");
			var def = MapnifyMenu.DefFromRule(uid,rule);
			if ( def < 0 ){
				continue;
			}
			MapnifyMenu.SetParam(uid,rule,def,param,value);
		}
	}
	return true;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetParamId = function(uid,ruid,param){
  if ( MapnifyMenu.__style[uid] == undefined ){
      //console.log(uid + " not in style");
      return undefined;
   }
   for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){
      for( var d = 0 ; d < Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ; d++){ //def
         if ( MapnifyMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
            for ( var p = 0 ; p < Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][d] ); p++){ //params
               var paramName = Symbolizer.getParamName(MapnifyMenu.__style[uid]["s"][rule]["s"][d]["rt"],p);
               if ( paramName == param ){
                   return MapnifyMenu.__style[uid]["s"][rule]["s"][d][paramName];
               }
            }
            //console.log(" not found , adding!" , uid , ruid , param);
            //MapnifyMenu.__style[uid]["s"][rule]["s"][d][param] = Symbolizer.default[param];           
            //return MapnifyMenu.__style[uid]["s"][rule]["s"][d][param]; 
         }
      }
   }
   //console.log(" not found !", uid , ruid, param);
   return undefined;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetZoomSpectra = function(uid,def){
	var zmin = undefined;
	var zmax = undefined;
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log(uid + " not in style");
		return {"zmin":zmin,"zmax":zmax};
	}

	for(var rule = 0 ; rule < Object.size(MapnifyMenu.__style[uid]["s"]) ; rule++){
		if ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) >= 3 ){
			var zminR = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
			var zmaxR = MapnifyMenu.__style[uid]["s"][rule]["zmax"];
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
MapnifyMenu.Load = function(){
	MapnifyMenu.LoadGroup();
}

//////////////////////////////////////////////////////////////
MapnifyMenu.ReLoad = function(){
    MapnifyMenu.__LoadStyle();
}

//////////////////////////////////////////////////////////////
// AJaX load group
MapnifyMenu.LoadGroup = function(){
  console.log("Loading groups");
  $.ajax({
     url: MapnifyMenu.serverRootDirV+'style/group2.json',
     async: false,
     dataType: 'json',
     //contentType:"application/x-javascript",
     success: function (data) {
        MapnifyMenu.groups = data;
        MapnifyMenu.LoadMapping();
     },
     error: function (){
        console.log("Loading group failed");
     }
  });
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__LoadMapping = function(){
   console.log("##### MAPPING ####");
   for(var entrie = 0 ; entrie < Object.size(MapnifyMenu.mapping) ; entrie++){
      console.log(MapnifyMenu.mapping[entrie]["name"]);
      // build mappingArray object
      for( var layer = 0 ; layer < Object.size(MapnifyMenu.mapping[entrie]["layers"]) ; layer++){
         //console.log("    filter : " + MapnifyMenu.mapping[entrie]["layers"][layer]["filter"]);
         //console.log("    uid : " + MapnifyMenu.mapping[entrie]["layers"][layer]["id"]);
         MapnifyMenu.mappingArray[ MapnifyMenu.mapping[entrie]["layers"][layer]["id"] ] = { name : MapnifyMenu.mapping[entrie]["name"] , filter : MapnifyMenu.mapping[entrie]["layers"][layer]["filter"]};
      }
   }
   MapnifyMenu.LoadStyle();  
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetUids = function(name){
	var ids = Array();
        if ( name == "none" ){
           return ids;
        }
	for(var entrie = 0 ; entrie < Object.size(MapnifyMenu.mapping) ; entrie++){
		if ( MapnifyMenu.mapping[entrie]["name"] == name){
			for( var layer = 0 ; layer < Object.size(MapnifyMenu.mapping[entrie]["layers"]) ; layer++){
				ids.push(MapnifyMenu.mapping[entrie]["layers"][layer]["id"]);
			}
		}
	}
	return ids;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetUid = function(name,filter){
	for(var entrie = 0 ; entrie < Object.size(MapnifyMenu.mapping) ; entrie++){
		if ( MapnifyMenu.mapping[entrie]["name"] == name){
			for( var layer = 0 ; layer < Object.size(MapnifyMenu.mapping[entrie]["layers"]) ; layer++){
				if ( MapnifyMenu.mapping[entrie]["layers"][layer]["filter"] == filter ){
					return MapnifyMenu.mapping[entrie]["layers"][layer]["id"];
				}
			}
		}
	}
	return null;
}

//////////////////////////////////////////////////////////////
// AJaX load mapping
MapnifyMenu.LoadMapping = function(){
  console.log("Loading mapping");
  $.ajax({
     url: MapnifyMenu.serverRootDirV+'style/mapping.json',
     async: false,
     dataType: 'json',
     //contentType:"application/x-javascript",
     success: function (data) {
        MapnifyMenu.mapping = data;
        MapnifyMenu.__LoadMapping();
     },
     error: function (){
        console.log("Loading mapping failed");
     }
  });
}

//////////////////////////////////////////////////////////////
// Dirty version ... draw view on the fly ...
MapnifyMenu.__LoadStyle = function(){

  MapnifyMenu.mapnifyParentEl.empty();   
  MapnifyMenu.mapnifyParentEl2.empty();   

  MapnifyMenu.mapnifyParentEl.hide(); // hide me during loading
  MapnifyMenu.mapnifyParentEl.css('width','400px'); // force width (avoid scrollbar issue)

  MapnifyMenu.mainDiv = $("<div id=\"mapnify_menu_maindiv\"></div>");
  MapnifyMenu.mainDiv.appendTo(MapnifyMenu.mapnifyParentEl);

    
  MapnifyMenu.widgetDiv = $('<div class="mapnify_menu_widgetDiv" id="mapnify_menu_widgetDiv"></div>');
  MapnifyMenu.widgetDiv.appendTo(MapnifyMenu.mapnifyParentEl2);

  //MapnifyMenu.__FillZoomDef();
  MapnifyMenu.__InsertZoomEdition();
  MapnifyMenu.__InsertAccordion();
}  

//////////////////////////////////////////////////////////////
MapnifyMenu.UpdateActivZoom = function(){
	MapnifyMenu.activZooms = [];
	for ( var z = 1 ; z < 19 ; ++z){
		if ( z == MapnifyMenu.refMap.GetZoom() ){
			console.log("map zoom is " + z);
			$("#mapnify_menu_zcheck"+z).button( "option", "label", "Z" + z + "*");
		}
		else{
			$("#mapnify_menu_zcheck"+z).button( "option", "label", "Z" + z );
		}
		if ( $("#mapnify_menu_zcheck" + z).is(":checked") ){
			MapnifyMenu.activZooms.push(z);    
			//$(".mapnify_menu_symbz"+z).show(); 
		}
		else{
			//$(".mapnify_menu_symbz"+z).hide();
			//nothing !
		} 
	} 
}

//////////////////////////////////////////////////////////////
MapnifyMenu.ZoomOut = function(){
	MapnifyMenu.refMap.ZoomOut();
	MapnifyMenu.UpdateActivZoom();
	MapnifyMenu.__BuildWidget(MapnifyMenu.currentGroup,MapnifyMenu.currentName,MapnifyMenu.currentUid);
}

MapnifyMenu.ZoomIn = function(){
	MapnifyMenu.refMap.ZoomIn();
	MapnifyMenu.UpdateActivZoom();
	MapnifyMenu.__BuildWidget(MapnifyMenu.currentGroup,MapnifyMenu.currentName,MapnifyMenu.currentUid);
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertZoomEdition = function(){

  $('<button onclick="MapnifyMenu.ReLoad()"  class="mapnify_menu_rlbutton" id="mapnify_menu_rlbutton"  > Reload </button>').appendTo(MapnifyMenu.mainDiv).hide();

  $('<button onclick="MapnifyMenu.ZoomOut()" class="mapnify_menu_zbutton" id="mapnify_menu_zbuttonminus" > - </button>').appendTo(MapnifyMenu.mainDiv);
  $('<button onclick="MapnifyMenu.ZoomIn()"  class="mapnify_menu_zbutton" id="mapnify_menu_zbuttonplus"  > + </button>').appendTo(MapnifyMenu.mainDiv);
  
  $("#mapnify_menu_rlbutton").button();
  $("#mapnify_menu_zbuttonminus").button();
  $("#mapnify_menu_zbuttonplus").button();

}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertZoomEdition2 = function(){

  var tmpcb = '';
  for ( var z = 1 ; z < 19 ; ++z){
      tmpcb += '  <input type="checkbox" class="mapnify_menu_checkboxz" id="mapnify_menu_zcheck' + z + '"/><label for="mapnify_menu_zcheck' + z + '">Z' + z + '</label>';
  }    
  
  $('<h2 class="mapnify_menu_par_title"> Edit some zoom</h2><div id="mapnify_menu_zoom_selector">' +  tmpcb + '</div>' ).appendTo(MapnifyMenu.widgetDiv);//.hide();
  $('<h2 class="mapnify_menu_par_title"> Edit a zoom range</h2><div id="mapnify_menu_sliderrangez"></div><br/>').appendTo(MapnifyMenu.widgetDiv);

  $( "#mapnify_menu_zoom_selector" ).buttonset();

  for ( var z = 1 ; z < 19 ; ++z){
      $("#mapnify_menu_zcheck"+z).change(function(){
           MapnifyMenu.UpdateActivZoom();
      });
  }
  
  $( "#mapnify_menu_sliderrangez" ).slider({
          range: true,
          min: 0,
          max: 18,
          values: [ MapnifyMenu.currentZmin, MapnifyMenu.currentZmax ],
          change: function( event, ui ) {
             var minV = ui.values[0];
             var maxV = ui.values[1];
             MapnifyMenu.currentZmin = minV;
             MapnifyMenu.currentZmax = maxV;
             for(var z = 1 ; z < 19 ; ++z){
                if ( z >= minV && z <= maxV){
                   $("#mapnify_menu_zcheck" + z ).check();
                }
                else{
                   $("#mapnify_menu_zcheck" + z ).uncheck();
                }
                $("#mapnify_menu_zcheck" + z ).button("refresh");
             }
             MapnifyMenu.UpdateActivZoom();
          },
          slide: function( event, ui ) {
             var minV = ui.values[0];
             var maxV = ui.values[1];
             MapnifyMenu.currentZmin = minV;
             MapnifyMenu.currentZmax = maxV;
             for(var z = 1 ; z < 19 ; ++z){
                if ( z >= minV && z <= maxV){
                   $("#mapnify_menu_zcheck" + z ).check();
                }
                else{
                   $("#mapnify_menu_zcheck" + z ).uncheck();
                }
                $("#mapnify_menu_zcheck" + z ).button("refresh");
             }
             MapnifyMenu.UpdateActivZoom();
          }
  });

  $( "#mapnify_menu_sliderrangez" ).slider( "values",  [MapnifyMenu.currentZmin, MapnifyMenu.currentZmax] );  

}

////
// in the next callback "_ruleId" is the *caller* rule id.
// but thanks to SetParamIdZNew we are updating many zooms at the same time
////

//////////////////////////////////////////////////////////////
// Closure for colorpicker callback
MapnifyMenu.GetColorPickerCallBack = function(_uid,_ruleId,pName){
   return function (hsb, hex, rgb) {
      $("#mapnify_menu_colorpicker_"+_ruleId +" div").css('backgroundColor', '#' + hex);
      MapnifyMenu.SetParamIdZNew(_uid,pName,ColorTools.HexToRGBA(hex));
   }
}

//////////////////////////////////////////////////////////////
// Closure for spinner callback
MapnifyMenu.GetSpinnerCallBack = function(_uid,_ruleId,pName){  
   return function (event, ui) {
      var newV = ui.value;
      MapnifyMenu.SetParamIdZNew(_uid,pName,newV);
   }
}

//////////////////////////////////////////////////////////////
// Closure for select callback
MapnifyMenu.GetSelectCallBack = function(_uid,_ruleId,_pName){
  return function (){
      var newV = $("#mapnify_menu_select_" + _pName + "_" + _ruleId + " option:selected").text();
      MapnifyMenu.SetParamIdZNew(_uid,_pName,newV);
      ///@todo bug ... seems to work only once ...
  }
}

//////////////////////////////////////////////////////////////
// Closure for checkbox callback
MapnifyMenu.GetCheckBoxCallBack = function(_uid){
    return function() {
       var vis = $("#mapnify_menu_check_" + _uid + ":checked").val()?true:false;
       MapnifyMenu.__style[_uid]["visible"] = vis; 
       MapnifyMenu.EventProxy.NewEvent();     ///@todo this is not in a "set" function ... I don't like that !!!
       //console.log( _uid, "visible",  vis );
    }
}; 

//////////////////////////////////////////////////////////////
MapnifyMenu.AddColorPicker = function(_paramName,_paramValue,_uid,_ruleId,_container){
   // add to view
   $("<li>" + _paramName + " : " + "<div class=\"colorSelector \" id=\"mapnify_menu_colorpicker_" + _ruleId + "\"><div style=\"background-color:" + ColorTools.RGBAToHex(_paramValue) + "\"></div></div> </li>").appendTo(_container);
   
   // plug callback
   $("#mapnify_menu_colorpicker_"+_ruleId).ColorPicker({
      	color: ColorTools.RGBAToHex(_paramValue),   // set initial value
       	onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
       },
       onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
       },
       onChange: MapnifyMenu.GetColorPickerCallBack(_uid,_ruleId,_paramName)
  });
}

//////////////////////////////////////////////////////////////
MapnifyMenu.AddSpinner = function(_paramName,_paramValue,_uid,_ruleId,_container,_step,_min,_max){
  // add to view
  $( "<li>" + _paramName + " : " +"<input id=\"mapnify_menu_spinner_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  
  // set callback
  $( "#mapnify_menu_spinner_"+_paramName+"_"+_ruleId ).spinner({
       //change: GetSpinnerCallBack(uid,ruleId,_paramName),
       spin: MapnifyMenu.GetSpinnerCallBack(_uid,_ruleId,_paramName),
       step: _step,
       min : _min,
       max : _max,
  });

  // set initial value    
  $( "#mapnify_menu_spinner_"+_paramName+"_"+_ruleId ).spinner("value" , _paramValue);  
}

//////////////////////////////////////////////////////////////
MapnifyMenu.AddCombo = function(_paramName,_paramValue,_uid,_ruleId,_container,_values){
  // add to view
  $( "<li>" + _paramName + " : " +"<select id=\"mapnify_menu_select_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  // add options
  for( var v = 0 ; v < Object.size(_values) ; v++){
    $("#mapnify_menu_select_" + _paramName + "_" + _ruleId).append("<option value=\"" + _values[v] + "\"> " + _values[v] + "</option>");
  }
  // set value
  $("#mapnify_menu_select_" + _paramName + "_" + _ruleId).val(_paramValue);
  // set callback
  $("#mapnify_menu_select_" + _paramName + "_" + _ruleId).change(MapnifyMenu.GetSelectCallBack(_uid,_ruleId,_paramName));
}

//////////////////////////////////////////////////////////////
MapnifyMenu.FillWidget = function(uid){
	if ( MapnifyMenu.__style[uid]["s"].length < 1 ){
		console.log("Error : empty style " + uid );
		return;
	}

	console.log("Current zoom is " , MapnifyMenu.refMap.GetZoom() , uid, def , rule); 

	//var def = 0; // first def is always the good one :-)
	var rd = MapnifyMenu.DefRuleIdFromZoom(uid,MapnifyMenu.refMap.GetZoom());
	var def = rd.def;
	var ruleId = rd.ruleId;
	var rule = rd.rule;
	
	console.log(def,ruleId,rule);
	
	if ( ruleId < 0 ){
     console.log("Cannot find ruleId for zoom " + MapnifyMenu.refMap.GetZoom());
     return;
    }

	if ( rule < 0 ){
     console.log("Cannot find rule for zoom " + MapnifyMenu.refMap.GetZoom());
     return;
    }
	
	if ( def < 0 ){
     console.log("Cannot find def for zoom " + MapnifyMenu.refMap.GetZoom());
     return;
    }
	
	var symbDiv = $('<div></div>');
	symbDiv.appendTo(MapnifyMenu.widgetDiv);
	
	var ulul = $("<ul></ul>");
	ulul.appendTo(symbDiv);

	for( var p = 0 ; p < Object.size(Symbolizer.params[MapnifyMenu.__style[uid]["s"][rule]["s"][def]["rt"]] ) ; p++){  // this is read from a list of known params. 

		var paramName = Symbolizer.getParamName(MapnifyMenu.__style[uid]["s"][rule]["s"][def]["rt"],p);
		var paramValue = MapnifyMenu.GetParamId(uid,ruleId,paramName);   

		if ( paramValue === undefined ){
			paramValue = Symbolizer.default[paramName];
			//continue;
		}
		//console.log( paramName + " : " + paramValue ) ;

		if ( paramName == "width" ){  
			MapnifyMenu.AddSpinner(paramName,paramValue,uid,ruleId,ulul,0.25,0,10);
		}
		else if ( paramName == "fill" || paramName == "stroke" ){
			MapnifyMenu.AddColorPicker(paramName,paramValue,uid,ruleId,ulul);
		}
		else if ( paramName == "alpha" ){
			MapnifyMenu.AddSpinner(paramName,paramValue,uid,ruleId,ulul,0.05,0,1);
		}
		else if ( paramName == "linejoin" ){
			MapnifyMenu.AddCombo(paramName,paramValue,uid,ruleId,ulul,Symbolizer.combos["linejoin"]);
		}  
		else if ( paramName == "linecap" ){
			MapnifyMenu.AddCombo(paramName,paramValue,uid,ruleId,ulul,Symbolizer.combos["linecap"]);
		}  
		else{
			$("<li>" + paramName + " : " + paramValue + "</li>").appendTo(ulul) ; 
		}
	}
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__BuildWidget = function(group,name,uid){
  
   console.log("building widget ",group,name,uid);
 
   //clear parent div
   MapnifyMenu.widgetDiv.empty();

   MapnifyMenu.currentUid = uid;
   MapnifyMenu.currentGroup = group;
   MapnifyMenu.currentName = name;
   
   if ( MapnifyMenu.__style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }

   MapnifyMenu.__InsertZoomEdition2();

   $("<h2 class=\"mapnify_menu_par_title\">" + MapnifyMenu.mappingArray[uid].name + "</h2>").appendTo(MapnifyMenu.widgetDiv);

   if( MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].type == "line" ){
      //console.log("I'm a line !");
      
      MapnifyMenu.FillWidget(uid);
      
      var casing = MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].casing;
      var center = MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].center;
      var casing_uid = MapnifyMenu.GetUid(casing,MapnifyMenu.mappingArray[uid].filter);
      var center_uid = MapnifyMenu.GetUid(center,MapnifyMenu.mappingArray[uid].filter);

      if ( casing_uid == null){
          //console.log("casing not found : " + casing);
      }
      else{
          //console.log("casing found : " + casing);
          $('<h2 class="mapnify_menu_par_title">Casing </h2>').appendTo(MapnifyMenu.widgetDiv);
          MapnifyMenu.FillWidget(casing_uid);
      }

      if ( center_uid == null){
          //console.log("center not found : " + center);
      }
      else{
          //console.log("center found : " + center);
          $('<h2 class="mapnify_menu_par_title"> Center line </h2>').appendTo(MapnifyMenu.widgetDiv);
          MapnifyMenu.FillWidget(center_uid);
      }                      
   }
   else if( MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].type == "poly" ){
      //console.log("I'm a poly !");
      var border = MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].line;
      var border_uid = MapnifyMenu.GetUid(border,MapnifyMenu.mappingArray[uid].filter);
      
      if ( border_uid == null){
          //console.log("border not found : " + border);
      }
      else{
          //console.log("border found : " + border);
      }      
   }

   MapnifyMenu.UpdateActivZoom();
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetWidgetCallBack = function(group,name,uid){
    return function(){
      //console.log(uid + " clicked");
      MapnifyMenu.__BuildWidget(group,name,uid);
    } 
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetGroupNameFilterFromLayerId = function(uid){
 for ( var group in MapnifyMenu.groups ){ // for all groups of element
    if (!MapnifyMenu.groups.hasOwnProperty(group)) {
     continue;
    }
    for ( var name in MapnifyMenu.groups[group] ){    // for elements in group
         if (!MapnifyMenu.groups[group].hasOwnProperty(name)) {
            continue;
         }
         var uids = MapnifyMenu.GetUids(name);
         var childs = Array();
         if ( MapnifyMenu.groups[group][name].type == "line" ){
            var casing = MapnifyMenu.groups[group][name].casing;
            var center = MapnifyMenu.groups[group][name].center;
            console.log(casing,center);
            childs = childs.concat( MapnifyMenu.GetUids(casing) );
            childs = childs.concat( MapnifyMenu.GetUids(center) );
         }
         else if (MapnifyMenu.groups[group][name].type == "poly"){
            childs = childs.concat( MapnifyMenu.GetUids(MapnifyMenu.groups[group][name].line) );
         } 
         else{
            ///@todo
         }
         console.log(group,name,uids);
         if ( uids.length == 0 ){
             continue;
         }
         // primary object case
         for (var i = 0 ; i < uids.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var _uid = uids[i];
           if ( uid == _uid ){
              return {"group": group,"name": name, "filter": MapnifyMenu.mappingArray[uid].filter, "uid": uid};
           }  
         }
         // child case
         for (var i = 0 ; i < childs.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var _uid = childs[i];
           if ( uid == _uid ){
              // lets find parent id
              for(var k = 0 ; k < uids.length ; ++k){
                 if ( MapnifyMenu.mappingArray[uids[k]].filter == MapnifyMenu.mappingArray[_uid].filter ){
                    return {"group": group,"name": name, "filter": MapnifyMenu.mappingArray[uid].filter, "uid": uids[k]};
                 }
              }
           }  
         }
    }
 }
 return {"group": null, "name": null, "filter": null, "uid": null};
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertAccordion = function(){

  $("#mapnify_menu_accordion").remove();

  var outterAcc = $("<div class=\"mapnify_menu_accordion\" id=\"mapnify_menu_accordion\"></div>");
  outterAcc.appendTo(MapnifyMenu.mainDiv);

  var groupNum = 0;

  for ( var group in MapnifyMenu.groups ){ // for all groups of element
    if (!MapnifyMenu.groups.hasOwnProperty(group)) {
     continue;
    }
    console.log(group);

    $("<h1 id=\"mapnify_menu_groupaccordion_head_group_" + groupNum + "\"> Group : " + group + "</h1>").appendTo(outterAcc);
    var groupAcc = $("<div class=\"mapnify_menu_accordion\" id=\"mapnify_menu_groupaccordion_div_group_" + groupNum +  "\"></div>");
    groupAcc.appendTo(outterAcc);

    groupNum++;

    for ( var name in MapnifyMenu.groups[group] ){    // for elements in group
         if (!MapnifyMenu.groups[group].hasOwnProperty(name)) {
            continue;
         }
         console.log("found ! : " + name );
         
         var uids = MapnifyMenu.GetUids(name);
         
         if ( uids.length == 0 ){
             console.log("Warning : no uid found for " + name, group);
             continue;
         }
         
         console.log("Found " + uids.length + " ids for " + name, group);
         
         for (var i = 0 ; i < uids.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var uid = uids[i];
           //console.log(uid);
           // make header
           $('<h2 id="mapnify_menu_headeraccordion_' + uid + '">' + MapnifyMenu.mappingArray[uid].name + "</h2>").appendTo(groupAcc);
           // bind onclick header event!
           $("#mapnify_menu_headeraccordion_"+uid).bind('click',MapnifyMenu.GetWidgetCallBack(group,name,uid));
           // fill inner div with some info
           var divIn = $("<div class=\"inner\" id=\"divinner_" + groupNum + "_" + uid + "\"></div>");
           divIn.appendTo(groupAcc);
           
           $("<strong>Properties :<strong>").appendTo(divIn);
           var ul = $("<ul></ul>");
           ul.appendTo(divIn);
                    
           $("<li>" + "Filter : " + MapnifyMenu.mappingArray[uid].filter + "</li>").appendTo(ul);
           $("<li>" + "Visible  : " + "<input type=\"checkbox\" id=\"mapnify_menu_check_" + uid + "\" />" + "</li>").appendTo(ul);
           $("#mapnify_menu_check_" + uid).click( MapnifyMenu.GetCheckBoxCallBack(uid) );
           $("#mapnify_menu_check_" + uid).attr('checked', MapnifyMenu.__style[uid]["visible"]);
           $("<li>" + "Place : " + MapnifyMenu.__style[uid]["layer"] + "</li>").appendTo(ul);

         } // end uid loop
    } // end name loop
  } // end group loop

  
  // fill an empty widget window ("zzz" does not exist !)
  MapnifyMenu.__BuildWidget("xxx","yyy","zzz");
  
  MapnifyMenu.UpdateActivZoom();

  // configure accordion(s)
  $( ".mapnify_menu_accordion" )
  .accordion({
      heightStyle: "content",
      collapsible: true,
      active: false
  })

  MapnifyMenu.mapnifyParentEl.show();   //show me !
}

//////////////////////////////////////////////////////////////
// AJaX load style
MapnifyMenu.LoadStyle = function(){
  console.log("Loading style");
  if ( MapnifyMenu.__style === undefined ){
    console.log("Style not defined ... reading default");
    $.ajax({
      url: MapnifyMenu.serverRootDirV+'style/style.json',
      //url: 'http://map.x-ray.fr/api/style/1_style_13ba851b4e18833e08e',
      async: false,
      dataType: 'json',
      //contentType:"application/x-javascript",
      success: function (data) {
          MapnifyMenu.__style = data;
          MapnifyMenu.__LoadStyle();
      },
      error: function (){
        console.log("Loading style failed");
      }  
    });
   }
   else{
      MapnifyMenu.__LoadStyle();
   }
   TileRenderer.SetStyle(MapnifyMenu.__style); // TileRenderer.js MUST BE LOADED
   MapnifyMenu.refMap.DrawScene(false,true);
}
  
 
//////////////////////////////////////////////////////////
//  init !
//////////////////////////////////////////////////////////
MapnifyMenu.init = function(container,container2,isMovable,maps,style){
  MapnifyMenu.mapnifyParentEl = container;
  MapnifyMenu.mapnifyParentEl2 = container2;
  MapnifyMenu.__style = style;
  MapnifyMenu.refMap = maps;
  MapnifyMenu.Load(); // will call LoadMapping and then LoadStyle ...
  if ( isMovable){
      MapnifyMenu.mapnifyParentEl.draggable();    
      MapnifyMenu.mapnifyParentEl2.draggable();    
  }
}// end class MapnifyMenu.init



