//-------------------------------------------//
// MapManager
//-------------------------------------------//

function MapManager(){

}

//-------------------------------------------//

MapManager.prototype.createMap = function(map)
{
   var params = new Object();
   params["user"] = App.user;
   params["map"] = map;

   console.log(map);
   
   $.ajax({  
      type: "POST",  
      url: "/createMap",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         console.log("map added");
         console.log(data);
      }
   });
}

//-------------------------------------------//