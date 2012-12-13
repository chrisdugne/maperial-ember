// -------------------------------------------//
//	 			UserManager
// -------------------------------------------//

this.UserManager = {};

// -------------------------------------------//

UserManager.getGoogleUser = function()
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
	    	p("user data : " + data);
	    	var user = $.parseJSON(data);
	    	
	    	window.Webapp.user.userUID = user.userUID;
	    	window.Webapp.user.email = user.email;
	    	window.Webapp.user.name = user.name;
	    	window.Webapp.user.maps = user.maps;
	    	window.Webapp.user.styles = user.styles;
	    	window.Webapp.user.datasets = user.datasets;
	    	window.Webapp.user.colorbars = user.colorbars;
	    	window.Webapp.user.fonts = user.fonts;
	    	window.Webapp.user.icons = user.icons;
		}
	});
}

// -------------------------------------------//