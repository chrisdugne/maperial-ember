//-------------------------------------------//
//DatasetManager
//-------------------------------------------//

this.DatasetManager = {};

//-------------------------------------------//

DatasetManager.getHeaders = function()
{
   for(var i=0; i< App.user.datasets.length; i++){
      (function(i){
         DatasetManager.getHeader(App.user.datasets.objectAt(i));
      })(i);
   }   
}

DatasetManager.getHeader = function(dataset)
{
   $.ajax({
      type: "GET",  
      url: App.Globals.mapServer + "/api/dataset/header/"+dataset.uid+"?sep="+dataset.separator,
      dataType: "json",
      success: function (data)
      {
         Utils.editObjectInArray(dataset, "header", data.header);
      },
      error: function()
      {
         Utils.editObjectInArray(dataset, "onError", true);
      }
   });
}


//-------------------------------------------//
   
DatasetManager.addDataset = function(dataset)
{
   var params = new Object();
   params["user"] = App.user;
   params["dataset"] = dataset;

   $.ajax({  
      type: "POST",  
      url: "/addDataset",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         DatasetManager.getHeader(dataset);
      }
   });
}

//-------------------------------------------//

DatasetManager.deleteDataset = function(dataset)
{
   $.ajax({  
      type: "DELETE",  
      url: App.Globals.mapServer + "/api/dataset?key=" + dataset.uid,
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         // remove from the user list
         App.user.datasets.removeObject(dataset);

         // remove from the db
         var params = new Object();
         params["dataset"] = dataset;

         $.ajax({  
            type: "POST",  
            url: "/removeDataset",
            data: JSON.stringify(params),  
            contentType: "application/json; charset=utf-8"
         });
      }
   });
}

//-------------------------------------------//

DatasetManager.validateRaterConfig = function(raster){

   var errorTitle = "This raster is not well configured";
   var checkMessage = "Check out this parameter : ";
   var area = "rasterErrorArea";

   $("#"+area).empty();

   if(!raster.x){
      Utils.alert(area, "error", errorTitle, checkMessage + "X column");
      return false;
   }   

   if(!raster.y){
      Utils.alert(area, "error", errorTitle, checkMessage + "Y column");
      return false;
   }   
   
   if(!raster.v){
      Utils.alert(area, "error", errorTitle, checkMessage + "Data");
      return false;
   }   
   
   if(!raster.proj){
      Utils.alert(area, "error", errorTitle, checkMessage + "Projection");
      return false;
   }   
   
   if(!raster.name){
      Utils.alert(area, "error", errorTitle, checkMessage + "Name");
      return false;
   }   
   
   return true;
}

//-------------------------------------------//

DatasetManager.createRaster = function(){
   
   var dataset = App.datasetsData.selectedDataset;
   var raster = App.datasetsData.rasterBeingConfigured;

   if(!DatasetManager.validateRaterConfig(raster))
      return;

   $.ajax({
      type: "POST",  
      url: App.Globals.mapServer + "/api/raster",
      data: $.param(raster),
      dataType: "json",
      error: function (e, message){
         console.log("RASTER BANG " + message);
      },
      success: function (data)
      {
         raster.uid = data.rasterUID;
         dataset.rasters.pushObject(raster);

         var params = new Object();
         params["dataset"] = dataset;
         params["raster"] = raster;

         $.ajax({
            type: "POST",
            url: "/addRaster",
            data: JSON.stringify(params),  
            contentType: "application/json; charset=utf-8",
            success: function (data, textStatus, jqXHR)
            {
               $('#configureRasterWindow').modal("hide");
            }
         });

         // http://map.x-ray.fr:8081/api/raster/1_raster_13cbba7cfda2f3ec449
         // {"running": 90.9091}
         // { "bbox" : [ 2.96564, 45.7647, 3.11383, 45.7973 ], "inP" : 17, "max" : 12.8822, "min" : 10.7532 }
      }
   });
}

//-------------------------------------------//

DatasetManager.deleteRaster = function(raster, dataset)
{
   // ------------ a virer

   dataset.rasters.removeObject(raster);

   // remove from the db
   var params = new Object();
   params["raster"] = raster;

   $.ajax({  
      type: "POST",  
      url: "/removeRaster",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8"
   });
   
   return;
    
   // ------------ 
   
   $.ajax({  
      type: "DELETE",  
      url: App.Globals.mapServer + "/api/raster?key=" + raster.uid,
      dataType: "text",
      success: function (data, textStatus, jqXHR)
      {
         dataset.rasters.removeObject(raster);

         // remove from the db
         var params = new Object();
         params["raster"] = raster;

         $.ajax({  
            type: "POST",  
            url: "/removeRaster",
            data: JSON.stringify(params),  
            contentType: "application/json; charset=utf-8"
         });
         
      }
   });
}

//-------------------------------------------//