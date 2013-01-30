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
      url: Globals.mapServer + "/api/dataset?key=" + dataset.uid,
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