// -------------------------------------------//
//	 	Mapnify Login Lib
// -------------------------------------------//

this.MapnifyAuth = {};

// -------------------------------------------//

MapnifyAuth.authorize = function() 
{
	var authorizeURL = "http://map.x-ray.fr/user/auth"
		+ "?redirect=" + App.Globals.APP_URL + "/mapnifyAuthToken";

	Utils.popup(authorizeURL, 'signin', 400, 150);
}

MapnifyAuth.badtoken = function () 
{
	console.log("badtoken !!!");
}

MapnifyAuth.tokenGranted = function (token, email) 
{
	App.user.set("email", email);
	App.user.set("mapnifyToken", token);
	App.user.set("loggedIn", true);
	
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
			data: {token : App.user.mapnifyToken},
			success: function (data, textStatus, jqXHR)
			{
				if(data.login)
				{
					MapnifyAuth.checkIfIsLoggedIn();
				}
				else{
					alert("logged out !");
					App.user.set("loggedIn", false);
				}
			}
		});
		
	}, 20*1000);
}

// -------------------------------------------//

MapnifyAuth.dummy = function()
{
	App.user.set("name", "Bob Le Bobby");
	App.user.set("email", "dummy@mapnify.fr");
	App.user.set("loggedIn", true);
	
	UserManager.getAccount();
}