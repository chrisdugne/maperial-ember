
function getGoogleUser()
{
	var params = new Object();
	params["user"] = window.Webapp.user;
	
	$.ajax({  
	    type: "POST",  
	    url: "/getGoogleUser",
	    data: JSON.stringify(params),  
	    contentType: "application/json; charset=utf-8",
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	console.log("user found : " +  data);
		}
	});
}