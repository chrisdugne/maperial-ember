//-------------------------------------------//
//MapManager
//-------------------------------------------//

function MapManager(){

}

//-------------------------------------------//

MapManager.prototype.getMaps = function(user){

   var map = user.maps[0];
   if(!map)return;
   
   $.ajax({
      type: "GET",
      url: App.Globals.mapServer + "/api/map/"+map.uid,
      dataType: "json",
      success: function (data, textStatus, jqXHR)
      {
         console.log("map received");
         console.log(data);
      }
   });
}

//-------------------------------------------//

MapManager.prototype.uploadNewMap = function(map)
{
   App.user.set("waiting", true);
   var me = this;
   
   console.log("uploadNewMap");
   
   console.log(map);
   
   $.ajax({
      type: "POST",
      url: App.Globals.mapServer + "/api/map?_method=DATA",
      data: JSON.stringify(map.config),  
      dataType: "json",
      success: function (data, textStatus, jqXHR)
      {
         console.log("result");
         console.log(data);
         var result = data.files[0];
         map.uid = result.uid;
         
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

   console.log("addMapInDB");
   
   $.ajax({  
      type: "POST",  
      url: "/createMap",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function (map)
      {
         console.log("success");
         console.log(map);
         
         App.user.maps.pushObject(map);
         App.user.set("waiting", false);
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

//-------------------------------------------//