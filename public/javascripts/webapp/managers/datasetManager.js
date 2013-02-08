//-------------------------------------------//
//DatasetManager
//-------------------------------------------//

this.DatasetManager = {};

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

DatasetManager.createRaster = function(dataset){

   var raster = new Object();
   raster.name = "MesCouillesSurTonNezCaFaitDindon";
   raster.datasetUID = dataset.uid;
   raster.x = "X(m)";
   raster.y = "Y(m)";
   raster.v = "data";
   raster.proj = "epsg";
   raster.zMin = "0";
   raster.zMax = "18";

   $.ajax({
      type: "POST",  
      url: App.Globals.mapServer + ":8081/api/raster",
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

            }
         });

         // http://map.x-ray.fr:8081/api/raster/1_raster_13cbba7cfda2f3ec449
         // {"running": 90.9091}
         // { "bbox" : [ 2.96564, 45.7647, 3.11383, 45.7973 ], "inP" : 17, "max" : 12.8822, "min" : 10.7532 }
      }
   });
}


//-------------------------------------------//