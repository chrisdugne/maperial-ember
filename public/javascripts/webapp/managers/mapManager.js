//=================================================================//
//MapManager
//=================================================================//

function MapManager(){

}

//=================================================================//

MapManager.prototype.createNewMap = function(){
   var map = {uid: null, name: "New Map", config: App.maperial.defaultConfig()};
   App.user.set("selectedMap", map);
}

//=================================================================//

MapManager.prototype.getMaps = function(user){

   var list = {uids : []};
   for(var i=0; i < user.maps.length; i++ ){
      list.uids.push(user.maps[i].uid);
   }

   if(list.uids.length == 0) 
      return;

   $.ajax({
      type: "POST",
      url: App.Globals.mapServer + "/api/map/list",
      data: JSON.stringify(list),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result)
      {
         var mapConfigs = result.maps;

         for(var i=0; i < user.maps.length; i++ ){
            for(mapUID in mapConfigs){
               if(user.maps[i].uid == mapUID){
                  user.maps[i].config = mapConfigs[mapUID];
                  break;
               }
            }
         }

         console.log("user.maps", user.maps);
      }
   });
}

//=================================================================//

MapManager.prototype.uploadNewMap = function(map)
{
   App.user.set("waiting", true);
   var me = this;

   $.ajax({
      type: "POST",
      url: App.Globals.mapServer + "/api/map?_method=DATA",
      data: JSON.stringify(map.config),  
      dataType: "json",
      success: function (data, textStatus, jqXHR)
      {
         var result = data.files[0];
         map.uid = result.uid;

         App.user.maps.pushObject(map);
         App.get('router').transitionTo('dashboard');

         me.addMapInDB(map);
      }
   });
}

//-------------------------------------------//

MapManager.prototype.addMapInDB = function(map)
{
   var params = new Object();
   params["user"] = App.user;
   params["map"] = map;

   $.ajax({  
      type: "POST",  
      url: "/createMap",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function (map)
      {
         App.user.set("waiting", false);
         App.get('router').transitionTo('dashboard');
      }
   });

}

//=================================================================//


MapManager.prototype.saveMap = function(map)
{
   var me = this;
   App.user.set("waiting", true);

   $.ajax({
      type: "POST",
      url: App.Globals.mapServer + "/api/map?_method=DATA&uid=" + map.uid,
      data: JSON.stringify(map.config), 
      dataType: "text",
      success: function()
      {
         me.editMapInDB(map);
      }
   });
}

//-------------------------------------------//

MapManager.prototype.editMapInDB = function(map)
{
   var params = new Object();
   params["map"] = map;

   $.ajax({  
      type: "POST",  
      url: "/editMap",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function()
      {
         App.user.set("waiting", false);
         App.get('router').transitionTo('dashboard');
      }
   });
}

//=================================================================//

MapManager.prototype.deleteMap = function(map)
{
   $.ajax({  
      type: "DELETE",  
      url: App.Globals.mapServer + "/api/map?key=" + map.uid,
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         // remove from the user list
         App.user.maps.removeObject(map);

         // remove from the db
         var params = new Object();
         params["map"] = map;

         $.ajax({  
            type: "POST",  
            url: "/removeMap",
            data: JSON.stringify(params),  
            contentType: "application/json; charset=utf-8"
         });
      }
   });
}

//=================================================================//

MapManager.prototype.exportMap = function(zoom){

   console.log("exportMap", zoom, App.user.selectedMap.config.map);
   var me = this;
   var bbox = App.user.selectedMap.config.map;
   var map = App.user.selectedMap;
   var _export = {
         confuid : map.uid, 
         mapUID : map.uid, 
         latmin : bbox.latMin,
         latmax : bbox.latMax,
         lonmin : bbox.lonMin,
         lonmax : bbox.lonMax,
   }
   
   $.ajax({
      type: "POST",  
      url: App.Globals.mapServer + "/api/export",
      data: $.param(_export),
      dataType: "json",
      error: function (e, message){
         console.log("Error during exportMap " + message);
      },
      success: function (data)
      {
         _export.uid = data.exportUID;
         map.exports.pushObject(_export);
         Utils.editObjectInArray(map, "hasNoExport", false);

         $('#exportMapWindow').modal("hide");

         me.addExport(_export);
         me.checkExport(_export);
      }
   });
}

MapManager.prototype.checkExport = function(_export){

   var me = this;
   Utils.editObjectInArray(_export, "onError", false);
   Utils.editObjectInArray(_export, "generating", true);

   $.ajax({
      type: "GET",  
      url: App.Globals.mapServer + "/api/export/info/"+_export.uid,
      dataType: "json",
      error: function (e, message){
         Utils.editObjectInArray(_export, "onError", true);
         Utils.editObjectInArray(_export, "generating", false);
         Utils.editObjectInArray(_export, "error", "Configuration refused by the server");
      },
      success: function (data)
      {
         if(data.done != undefined){
            Utils.editObjectInArray(_export, "percentage", data.done);
            setTimeout(function(){me.checkExport(_export)}, MapManager.CHECK_RASTER_MILLIS);
         }
         else{
            Utils.editObjectInArray(_export, "generating", false);

            if(data.error != undefined && data.errCode != 0){
               // { "errcode" : 3, "error" : "Projection failed" }

               console.log("ERROR", data.error);
               Utils.editObjectInArray(_export, "onError", true);
               Utils.editObjectInArray(_export, "error", data.error);
            }
         }
      }
   });

}

//-------------------------------------------//

MapManager.prototype.addExport = function(_export)
{
   var params = new Object();
   params["map"] = App.user.selectedMap;
   params["export"] = _export;

   $.ajax({
      type: "POST",
      url: "/addExport",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8"
   });   
}

//-------------------------------------------//

MapManager.prototype.deleteExport = function(_export, map)
{
   // ------------ a virer

   map.exports.removeObject(_export);
   Utils.editObjectInArray(map, "hasNoExport", map.exports.length == 0);

   // remove from the db
   var params = new Object();
   params["export"] = _export;

   $.ajax({  
      type: "POST",  
      url: "/removeExport",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8"
   });


   return;

   // ------------ 

   $.ajax({  
      type: "DELETE",  
      url: App.Globals.mapServer + "/api/export?key=" + _export.uid,
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         map.exports.removeObject(_export);
         Utils.editObjectInArray(map, "hasNoExport", map.exports.length == 0);

         // remove from the db
         var params = new Object();
         params["export"] = _export;

         $.ajax({  
            type: "POST",  
            url: "/removeExport",
            data: JSON.stringify(params),  
            contentType: "application/json; charset=utf-8"
         });

      }
   });
}

