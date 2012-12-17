// -------------------------------------------//
//	 			UserManager
// -------------------------------------------//

this.UserManager = {};

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
	    	p("user data : " + data);
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