// -------------------------------------------//
//	 	Mapnify Login Lib
// -------------------------------------------//

this.MapnifyAuth = {};

// -------------------------------------------//

MapnifyAuth.authorize = function() 
{
	var authorizeURL = "http://map.x-ray.fr/user/auth"
		+ "?redirect=" + Globals.APP_URL + "/mapnifyAuthToken";

	Utils.popup(authorizeURL, 'signin', 400, 150);
}

MapnifyAuth.badtoken = function () 
{
	console.log("badtoken !!!");
}

MapnifyAuth.tokenGranted = function (token, email) 
{
	window.Webapp.user.set("email", email);
	window.Webapp.user.set("mapnifyToken", token);
	window.Webapp.user.set("loggedIn", true);
	
	UserManager.getAccount();
	
	MapnifyAuth.checkPresence();
}

//-------------------------------------------//

MapnifyAuth.checkIfIsLoggedIn = function()
{
	setTimeout(function(){
		$.ajax({
			type: "POST",  
			url: "http://map.x-ray.fr/user/islogin",
			data: {token : window.Webapp.user.mapnifyToken},
			success: function (data, textStatus, jqXHR)
			{
				if(data.login)
				{
					MapnifyAuth.checkIfIsLoggedIn();
				}
				else{
					alert("logged out !");
					window.Webapp.user.set("loggedIn", false);
				}
			}
		});
		
	}, 20*1000);
}

// -------------------------------------------//

MapnifyAuth.dummy = function()
{
	window.Webapp.user.set("name", "Bob Le Bobby");
	window.Webapp.user.set("email", "dummy@mapnify.fr");
	window.Webapp.user.set("loggedIn", true);
	
	UserManager.getAccount();
}