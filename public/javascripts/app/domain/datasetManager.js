
this.DatasetManager = {};

DatasetManager.addDataset = function(dataset)
{
	var params = new Object();
	params["user"] = window.Webapp.user;
	params["dataset"] = dataset;
	
	$.ajax({  
	    type: "POST",  
	    url: "/addDataset",
	    data: JSON.stringify(params),  
	    contentType: "application/json; charset=utf-8",
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	p("file saved");
	    	p("data : " + data);
		}
	});
}