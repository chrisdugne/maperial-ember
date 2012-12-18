// -------------------------------------------//
//	 	Mapnify Login Lib
// -------------------------------------------//

this.MapnifyAuth = {};

// -------------------------------------------//

// Logging in through the init process (onload = GoogleAuthOnload)
// <script src="https://apis.google.com/js/client.js?onload=GoogleAuthOnload"></script>
//GoogleAuthOnload = function(app) 
//{
//	gapi.client.setApiKey(Globals.apiKey);
//	window.setTimeout(GoogleAuth.checkGoogleAuth,1);
//}

// -------------------------------------------//

MapnifyAuth.authorize = function() 
{
	var authorizeURL = "http://map.x-ray.fr:8010/oauth2/authorize"
		+ "?redirect_uri=" + Globals.APP_URL + "/mapnifyCode"
		+ "&client_id=93efb0403eb7080ad68b7b1b8aab90"
		+ "&response_type=code";

	$("#mapnifyAuthFrame").show(200);
	$("#mapnifyAuthFrame").attr('src', authorizeURL);
}

// -------------------------------------------//

MapnifyAuth.dummyAuthDev = function()
{
	window.Webapp.user.set("name", "Bob Le Bobby");
	window.Webapp.user.set("email", "dummy@mapnify.fr");
	window.Webapp.user.set("loggedIn", true);
	
	UserManager.getAccount();
}

