//------------------------------------------------------------------------------------------//
// Logging in through the init process (onload)

function googleLoad(app) 
{
	gapi.client.setApiKey(window.Webapp.globals.apiKey);
	window.setTimeout(checkGoogleAuth,1);
}

function checkGoogleAuth() 
{
	var globals = window.Webapp.globals;
	gapi.auth.authorize({client_id: globals.googleClientId, scope: globals.scopes, immediate: true}, googleAuthResult);
}

//------------------------------------------------------------------------------------------//
// Logging in through the login window
	
function googleAuthorize(event) 
{
	var globals = window.Webapp.globals;
	gapi.auth.authorize({client_id: globals.googleClientId, scope: globals.scopes, immediate: false}, googleAuthResult);
	return false;
}

//------------------------------------------------//

function googleAuthResult(authResult) 
{
	if (authResult && !authResult.error) 
	{
		window.Webapp.user.set("loggedIn", true);
		$("#signinButton").fadeOut(1350);
		getGoogleUserInfo();
	}
	else 
	{
		$("#signinButton").click(openLoginWindow);
		Ember.Route.transitionTo("home");
	}
}

//------------------------------------------------------------------------------------------//

function getGoogleUserInfo() 
{
//	gapi.client.load('plus', 'v1', function() {
//		var request = gapi.client.plus.people.get({
//			'userId': 'me'
//		});

	gapi.client.load('oauth2', 'v2', function() {
		var request = gapi.client.oauth2.userinfo.get({
			'fields': 'email,name,picture'
		});
		
		
		request.execute(function(response) 
		{
//			if(response.picture)
//				image.src = response.picture;
			 
			window.Webapp.user.set("name", response.name);
			window.Webapp.user.set("email", response.email);
			
			// call to userManager.getGoogleUser();
			getGoogleUser();
		});
	});
}