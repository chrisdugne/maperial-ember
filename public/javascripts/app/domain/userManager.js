// -------------------------------------------//
//	 			UserManager
// -------------------------------------------//

this.UserManager = {};

// -------------------------------------------//
// init getPublicData

$.ajax({  
	type: "POST",  
	url: "/getPublicData",
	dataType: "text",
	success: function (data, textStatus, jqXHR)
	{
		console.log("UserManager.getPublicData | data : " + data);
		var publicData = $.parseJSON(data);

		window.Webapp.publicData.set("maps", publicData.maps);
		window.Webapp.publicData.set("styles", publicData.styles);
		window.Webapp.publicData.set("datasets", publicData.datasets);
		window.Webapp.publicData.set("colorbars", publicData.colorbars);
		window.Webapp.publicData.set("fonts", publicData.fonts);
		window.Webapp.publicData.set("icons", publicData.icons);
		
		//Utils.thumbURL(window.Webapp.publicData.styles[0].uid);
	}
});

// -------------------------------------------//

UserManager.getAccount = function()
{
	var params = new Object();
	params["user"] = window.Webapp.user;
	
	$.ajax({  
	    type: "POST",  
	    url: "/getAccount",
	    data: JSON.stringify(params),  
	    contentType: "application/json; charset=utf-8",
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	console.log("user data : " + data);
	    	var account = $.parseJSON(data);
	    	
	    	window.Webapp.user.set("uid", account.uid);
	    	window.Webapp.user.set("email", account.email);
	    	window.Webapp.user.set("name", account.name);
	    	window.Webapp.user.set("maps", account.maps);
	    	window.Webapp.user.set("styles", account.styles);
	    	window.Webapp.user.set("datasets", account.datasets);
	    	window.Webapp.user.set("colorbars", account.colorbars);
	    	window.Webapp.user.set("fonts", account.fonts);
	    	window.Webapp.user.set("icons", account.icons);
		}
	});
}

// -------------------------------------------//