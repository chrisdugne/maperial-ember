//-------------------------------------------//
//MapManager
//-------------------------------------------//

function MapManager(){

}

//-------------------------------------------//

MapManager.prototype.getMaps = function(user){

   var list = {uids : []};
   for(var i=0; i < user.maps.length; i++ ){
      list.uids.push(user.maps[i].uid);
   }
   
   $.ajax({
      type: "POST",
      url: App.Globals.mapServer + "/api/map/list",
      data: JSON.stringify(list),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result)
      {
         var maps = result.maps;

         for(uid in maps){
            console.log(maps[uid]);
         }
      }
   });
}

//-------------------------------------------//

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