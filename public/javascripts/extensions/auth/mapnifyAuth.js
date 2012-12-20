// -------------------------------------------//
//	 	Mapnify Login Lib
// -------------------------------------------//

this.MapnifyAuth = {};

// -------------------------------------------//

MapnifyAuth.authorize = function() 
{
	var authorizeURL = "http://map.x-ray.fr:8082/user/auth"
		+ "?redirect=" + Globals.APP_URL + "/mapnifyAuthToken";

	Utils.popup(authorizeURL, 'signin', 400, 150);
}

MapnifyAuth.badtoken = function () 
{
	console.log("badtoken !!!");
}

MapnifyAuth.tokenGranted = function (email) 
{
	//window.Webapp.user.set("name", "Bob Le Bobby");
	window.Webapp.user.set("email", email);
	window.Webapp.user.set("loggedIn", true);
	
	UserManager.getAccount();
}

// -------------------------------------------//

MapnifyAuth.dummyAuthDev = function()
{
	window.Webapp.user.set("name", "Bob Le Bobby");
	window.Webapp.user.set("email", "dummy@mapnify.fr");
	window.Webapp.user.set("loggedIn", true);
	
	UserManager.getAccount();
}

