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

/*
this.MapnifyMenu.WidgetCTOR = function(){
  this.name = "";
  this.id = "";
  this.ruleIds = {};
  for(var i = 0 ; i < 18 ; i=i+1){
    this.ruleIds[i] = "";  
  }
  this.buildFunctor = function(){};
  this.callbackFunctor = function(){};
  this.friend = null;
}

this.MapnifyMenu.WidgetCTOR2 = function(_name,_id,_build,_callback,_friend,_zoomsId){
  this.name = _name;
  this.id = _id;
  this.ruleIds = {};
  for(var i = 0 ; i < 18 ; i=i+1){
    this.ruleIds[i] = _zoomsId[i];  
  }    
  this.buildFunctor = _build;
  this.callbackFunctor = _callback;
  this.friend = _friend;
}
*/

// -------------------------------------------//

//////////////////////////////////////////////////////////////
// SOME GLOBAL VARS

MapnifyMenu.serverRootDirV = "http://192.168.1.19/project/mycarto/wwwClient/";			// local
//MapnifyMenu.serverRootDirV = "http://serv.x-ray.fr/project/mycarto/wwwClient/"; 		// not local ...
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

///@todo drop "casing" (and other lovable thing like centerline) , replace with additionnal "border" prop for each line / poly
///@todo define a xsmall small standard large xlarge size for each element and each zoom level
///@todo "pretty mode" : build pre-def edit widget and tree from a list of name and symb-ids / params

//////////////////////////////////////////////////////////////
MapnifyMenu.RuleFromDef = function(uid,def){
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
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
		def = def + 1;
		if ( def >= Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
			console.log("cannot find def ...", uid, rule);
			def = -1;
		}
	}
	return def;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.DefRuleFromZoom = function(uid,zoom){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return {"def" : -1, "rule" : -1};
	}

	for(var rule in MapnifyMenu.__style[uid]["s"]){ // rule
		var zmin = MapnifyMenu.__style[uid]["s"][rule]["zmin"];
		if ( zmin == zoom ){
			var def = 0;
			while ( Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"][def]) < 3 ){
				def = def + 1;
				if ( def >= Object.size(MapnifyMenu.__style[uid]["s"][rule]["s"]) ){
					console.log("cannot find def ...", uid, rule);
					def = -1;
				}
				return {"def" : def, "rule" : rule};
			}
		}
	}
	return {"def" : -1, "rule" : -1};
}

//////////////////////////////////////////////////////////////
MapnifyMenu.DefFromRuleId = function(uid,ruleId){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return -1;
	}

	var def = 0;
	for(var rule in MapnifyMenu.__style[uid]["s"]){ // rule
		for( var d in MapnifyMenu.__style[uid]["s"][rule]["s"]){ //def
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

//////////////////////////////////////////////////////////////
MapnifyMenu.SetParam = function(uid,rule,def,param,value){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return false;
	}

	var ok = false;
	for( var p in MapnifyMenu.__style[uid]["s"][rule]["s"][def] ){ // params
		if ( p == param ){
			MapnifyMenu.__style[uid]["s"][rule]["s"][def][p] = value;
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
	return ok;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.SetParamId = function(uid,ruid,param,value){
	if ( MapnifyMenu.__style[uid] == undefined ){
		//console.log( uid + " not in style");
		return false;
	}
	for(var rule in MapnifyMenu.__style[uid]["s"]){
		for( var d in MapnifyMenu.__style[uid]["s"][rule]["s"]){ //def
			if( MapnifyMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
				for( var p in MapnifyMenu.__style[uid]["s"][rule]["s"][d] ){ //params
					if ( p == param ){
						MapnifyMenu.__style[uid]["s"][rule]["s"][d][p] = value;
						return true;
					}
				}
				//console.log(" not found , adding!" , uid , ruid , param);
				MapnifyMenu.__style[uid]["s"][rule]["s"][d][param] = value;
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

	for(var rule in MapnifyMenu.__style[uid]["s"]){
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
   for(var rule in MapnifyMenu.__style[uid]["s"]){
      for( var d in MapnifyMenu.__style[uid]["s"][rule]["s"]){ //def
         if ( MapnifyMenu.__style[uid]["s"][rule]["s"][d]["id"] == ruid ){
            for ( var p in MapnifyMenu.__style[uid]["s"][rule]["s"][d] ){ //params
               if ( p == param ){
                   return MapnifyMenu.__style[uid]["s"][rule]["s"][d][p];
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

	for(var rule in MapnifyMenu.__style[uid]["s"]){
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
   for(var entrie in MapnifyMenu.mapping){
      console.log(MapnifyMenu.mapping[entrie]["name"]);
      // build mappingArray object
      for( var layer in MapnifyMenu.mapping[entrie]["layers"]){
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
	for(var entrie in MapnifyMenu.mapping){
		if ( MapnifyMenu.mapping[entrie]["name"] == name){
			for( var layer in MapnifyMenu.mapping[entrie]["layers"]){
				ids.push(MapnifyMenu.mapping[entrie]["layers"][layer]["id"]);
			}
		}
	}
	return ids;
}

//////////////////////////////////////////////////////////////
MapnifyMenu.GetUid = function(name,filter){
	for(var entrie in MapnifyMenu.mapping){
		if ( MapnifyMenu.mapping[entrie]["name"] == name){
			for( var layer in MapnifyMenu.mapping[entrie]["layers"]){
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

  var mainDiv = $("<div id=\"mapnify_menu_div\"</div>");
  mainDiv.appendTo(MapnifyMenu.mapnifyParentEl);

    
  var widgetDiv = $('<div class="widgetDiv" id="widgetDiv"></div>');
  widgetDiv.appendTo(MapnifyMenu.mapnifyParentEl2);

  //MapnifyMenu.__FillZoomDef();
  MapnifyMenu.__InsertZoomEdition(mainDiv,widgetDiv);
  MapnifyMenu.__InsertAccordion(mainDiv,widgetDiv);
}  

//////////////////////////////////////////////////////////////
MapnifyMenu.UpdateActivZoom = function(){
	MapnifyMenu.activZooms = [];
	for ( var z = 1 ; z < 19 ; ++z){
		if ( z == MapnifyMenu.refMap.GetZoom() ){
			console.log("map zoom is " + z);
			$("#zcheck"+z).button( "option", "label", "Z" + z + "*");
		}
		else{
			$("#zcheck"+z).button( "option", "label", "Z" + z );
		}
		if ( $("#zcheck" + z).is(":checked") ){
			MapnifyMenu.activZooms.push(z);    
			//$(".symbz"+z).show(); 
		}
		else{
			//$(".symbz"+z).hide();
			//nothing !
		} 
	} 
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertZoomEdition = function(_mainDiv,_widgetDiv){

  $('<button onclick="MapnifyMenu.ReLoad()"  class="rlbutton" id="rlbutton"  > Reload </button>').appendTo(_mainDiv);

  $('<button onclick="MapnifyMenu.refMap.ZoomOut();MapnifyMenu.UpdateActivZoom();" class="zbutton" id="zbuttonminus" > - </button>').appendTo(_mainDiv);
  $('<button onclick="MapnifyMenu.refMap.ZoomIn();MapnifyMenu.UpdateActivZoom();"  class="zbutton" id="zbuttonplus"  > + </button>').appendTo(_mainDiv);
  
  $("#rlbutton").button();
  $("#zbuttonminus").button();
  $("#zbuttonplus").button();

  //__InsertZoomEdition2(_mainDiv,_widgetDiv);
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertZoomEdition2 = function(_mainDiv,_widgetDiv){

  var tmpcb = '';
  for ( var z = 1 ; z < 19 ; ++z){
      tmpcb += '  <input type="checkbox" class="checkboxz" id="zcheck' + z + '"/><label for="zcheck' + z + '">Z' + z + '</label>';
      //if ( z % 6 == 0){
      //   tmpcb += '<br>';
      //}
  }    
  
  $('<h2> Edit some zoom</h2><div id="zoom_selector">' +  tmpcb + '</div>' ).appendTo(_widgetDiv);//.hide();
  $('<h2> Edit a zoom range</h2><div id="sliderrangez"></div><br/>').appendTo(_widgetDiv);

  $( "#zoom_selector" ).buttonset();

  for ( var z = 1 ; z < 19 ; ++z){
      $("#zcheck"+z).change(function(){
           MapnifyMenu.UpdateActivZoom();
      });
  }
  
  $( "#sliderrangez" ).slider({
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
                   $("#zcheck" + z ).check();
                }
                else{
                   $("#zcheck" + z ).uncheck();
                }
                $("#zcheck" + z ).button("refresh");
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
                   $("#zcheck" + z ).check();
                }
                else{
                   $("#zcheck" + z ).uncheck();
                }
                $("#zcheck" + z ).button("refresh");
             }
             MapnifyMenu.UpdateActivZoom();
          }
  });

  $( "#sliderrangez" ).slider( "values",  [MapnifyMenu.currentZmin, MapnifyMenu.currentZmax] );  

}

////
// in the next callback "_ruleId" is the *caller* rule id.
// but thanks to SetParamIdZNew we are updating many zooms at the same time
////

//////////////////////////////////////////////////////////////
// Closure for colorpicker callback
MapnifyMenu.GetColorPickerCallBack = function(_uid,_ruleId,pName){
   return function (hsb, hex, rgb) {
      $("#colorpicker_"+_ruleId +" div").css('backgroundColor', '#' + hex);
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
      var newV = $("#select_" + _pName + "_" + _ruleId + " option:selected").text();
      MapnifyMenu.SetParamIdZNew(_uid,_pName,newV);
      ///@todo bug ... seems to work only once ...
  }
}

//////////////////////////////////////////////////////////////
// Closure for checkbox callback
MapnifyMenu.GetCheckBoxCallBack = function(_uid){
    return function() {
       var vis = $("#check_" + _uid + ":checked").val()?true:false;
       MapnifyMenu.__style[_uid]["visible"] = vis; 
       //console.log( _uid, "visible",  vis );
    }
}; 

//////////////////////////////////////////////////////////////
MapnifyMenu.AddColorPicker = function(_paramName,_paramValue,_uid,_ruleId,_container){
   // add to view
   $("<li>" + _paramName + " : " + "<div class=\"colorSelector \" id=\"colorpicker_" + _ruleId + "\"><div style=\"background-color:" + ColorTools.RGBAToHex(_paramValue) + "\"></div></div> </li>").appendTo(_container);
   
   // plug callback
   $("#colorpicker_"+_ruleId).ColorPicker({
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
  $( "<li>" + _paramName + " : " +"<input id=\"spinner_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  
  // set callback
  $( "#spinner_"+_paramName+"_"+_ruleId ).spinner({
       //change: GetSpinnerCallBack(uid,ruleId,_paramName),
       spin: MapnifyMenu.GetSpinnerCallBack(_uid,_ruleId,_paramName),
       step: _step,
       min : _min,
       max : _max,
  });

  // set initial value    
  $( "#spinner_"+_paramName+"_"+_ruleId ).spinner("value" , _paramValue);  
}

//////////////////////////////////////////////////////////////
MapnifyMenu.AddCombo = function(_paramName,_paramValue,_uid,_ruleId,_container,_values){
  // add to view
  $( "<li>" + _paramName + " : " +"<select id=\"select_" + _paramName + "_" + _ruleId + "\"></li>").appendTo(_container);
  // add options
  for( var v in _values ){
    $("#select_" + _paramName + "_" + _ruleId).append("<option value=\"" + _values[v] + "\"> " + _values[v] + "</option>");
  }
  // set value
  $("#select_" + _paramName + "_" + _ruleId).val(_paramValue);
  // set callback
  $("#select_" + _paramName + "_" + _ruleId).change(MapnifyMenu.GetSelectCallBack(_uid,_ruleId,_paramName));
}

//////////////////////////////////////////////////////////////
MapnifyMenu.FillWidget = function(uid,wDiv){

   if ( MapnifyMenu.__style[uid]["s"].length < 1 ){
        console.log("Error : empty style " + uid );
		return;
   }

   var def = 0; // first def is always the good one :-)
	 
	 var ruleId = MapnifyMenu.RuleFromDef(uid,def); 
	 
	 if ( ruleId == null ){
		console.log("Cannot find not empty ruleId for " + uid + " ( " + def + ")" );
		return;
	 }
	 
	 var symbDiv = $('<div></div>');
	 symbDiv.appendTo(wDiv);

	 var ulul = $("<ul></ul>");
	 ulul.appendTo(symbDiv);
  
	 for( var p in Symbolizer.params[MapnifyMenu.__style[uid]["s"][0]["s"][def]["rt"]] ){  // this is read from a list of known params. 
	 
		var paramName = Symbolizer.getParamName(MapnifyMenu.__style[uid]["s"][0]["s"][def]["rt"],p);
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
MapnifyMenu.__BuildWidget = function(group,name,uid,mainDiv,wDiv){
   
   //clear parent div
   wDiv.empty();

   if ( MapnifyMenu.__style[uid] == undefined ){
      console.log( uid + " not in style");
      return;
   }

   MapnifyMenu.__InsertZoomEdition2(mainDiv,wDiv);

   $("<h2><strong>" + MapnifyMenu.mappingArray[uid].name + "</strong></h2>").appendTo(wDiv);

   if( MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].type == "line" ){
      //console.log("I'm a line !");
      
      MapnifyMenu.FillWidget(uid,wDiv);
      
      var casing = MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].casing;
      var center = MapnifyMenu.groups[group][MapnifyMenu.mappingArray[uid].name].center;
      var casing_uid = MapnifyMenu.GetUid(casing,MapnifyMenu.mappingArray[uid].filter);
      var center_uid = MapnifyMenu.GetUid(center,MapnifyMenu.mappingArray[uid].filter);

      if ( casing_uid == null){
          //console.log("casing not found : " + casing);
      }
      else{
          //console.log("casing found : " + casing);
          $('<h2><strong> Casing </h2></strong>').appendTo(wDiv);
          MapnifyMenu.FillWidget(casing_uid,wDiv);
      }

      if ( center_uid == null){
          //console.log("center not found : " + center);
      }
      else{
          //console.log("center found : " + center);
          $('<h2><strong> Center line </h2></strong>').appendTo(wDiv);
          MapnifyMenu.FillWidget(center_uid,wDiv);
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
MapnifyMenu.GetWidgetCallBack = function(group,name,uid,maindiv,wdiv){
    return function(){
      //console.log(uid + " clicked");
      MapnifyMenu.__BuildWidget(group,name,uid,maindiv,wdiv);
    } 
}

//////////////////////////////////////////////////////////////
MapnifyMenu.__InsertAccordion = function(mainDiv,widgetDiv){

  $("#mapnifyaccordion").remove();

  var outterAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifyaccordion\"></div>");
  outterAcc.appendTo(mainDiv);

  var groupNum = 0;

  for ( var group in MapnifyMenu.groups ){ // for all groups of element

    console.log(group);

    $("<h1 id=\"mapnifygroupaccordion_head_group_" + groupNum + "\"> Group : " + group + "</h1>").appendTo(outterAcc);
    var groupAcc = $("<div class=\"mapnifyaccordion\" id=\"mapnifygroupaccordion_div_group_" + groupNum +  "\"></div>");
    groupAcc.appendTo(outterAcc);

    groupNum++;

    for ( var name in MapnifyMenu.groups[group] ){    // for elements in group

         console.log("found ! : " + name );
         
         var uids = MapnifyMenu.GetUids(name);
         for (var i = 0 ; i < uids.length ; i++){        // for uids of type "element" (different filters ... see landmark for exemple)
           var uid = uids[i];
           //console.log(uid);
           // make header
           $('<h2 id="headeraccordion_' + uid + '">' + MapnifyMenu.mappingArray[uid].name + "</h2>").appendTo(groupAcc);
           // bind onclick header event!
           $("#headeraccordion_"+uid).bind('click',MapnifyMenu.GetWidgetCallBack(group,name,uid,mainDiv,widgetDiv));
           // fill inner div with some info
           var divIn = $("<div class=\"inner\" id=\"divinner_" + groupNum + "_" + uid + "\"></div>");
           divIn.appendTo(groupAcc);
           
           $("<strong>Properties :<strong>").appendTo(divIn);
           var ul = $("<ul></ul>");
           ul.appendTo(divIn);
                    
           $("<li>" + "Filter : " + MapnifyMenu.mappingArray[uid].filter + "</li>").appendTo(ul);
           $("<li>" + "Visible  : " + "<input type=\"checkbox\" id=\"check_" + uid + "\" />" + "</li>").appendTo(ul);
           $("#check_" + uid).click( MapnifyMenu.GetCheckBoxCallBack(uid) );
           $("#check_" + uid).attr('checked', MapnifyMenu.__style[uid]["visible"]);
           $("<li>" + "Place : " + MapnifyMenu.__style[uid]["layer"] + "</li>").appendTo(ul);

         } // end uid loop
    } // end name loop
  } // end group loop

  
  // fill an empty widget window ("zzz" does not exist !)
  MapnifyMenu.__BuildWidget("xxx","yyy","zzz",mainDiv,widgetDiv);
  
  MapnifyMenu.UpdateActivZoom();

  // configure accordion(s)
  $( ".mapnifyaccordion" )
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
  $.ajax({
     url: MapnifyMenu.serverRootDirV+'style/style.json',
     async: false,
     dataType: 'json',
     //contentType:"application/x-javascript",
     success: function (data) {
        MapnifyMenu.__style = data;
        MapnifyMenu.__LoadStyle();
     }  
  });   
}
  
 
//////////////////////////////////////////////////////////
//  init !
//////////////////////////////////////////////////////////
MapnifyMenu.init = function(container,container2,isMovable,maps){
  MapnifyMenu.mapnifyParentEl = container;
  MapnifyMenu.mapnifyParentEl2 = container2;
  MapnifyMenu.refMap = maps;
  MapnifyMenu.Load(); // will call LoadMapping and then LoadStyle ...
  if ( isMovable){
      MapnifyMenu.mapnifyParentEl.draggable();    
      MapnifyMenu.mapnifyParentEl2.draggable();    
  }
}// end class MapnifyMenu.init



