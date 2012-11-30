//------------------------------------------------------------------------------------------//

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

//------------------------------------------------//

function googleAuthResult(authResult) 
{
	if (authResult && !authResult.error) 
	{
		window.Webapp.user.set("loggedIn", true);
		$("#signinButton").fadeOut(1350);
		getGoogleUser();
	}
	else 
	{
		$("#signinButton").click(openLoginWindow);
		Ember.Route.transitionTo("home");
	}
}

//------------------------------------------------------------------------------------------//

function openLoginWindow() 
{
	$('#loginWindow').modal();
}
	
function googleAuthorize(event) 
{
	var globals = window.Webapp.globals;
	gapi.auth.authorize({client_id: globals.googleClientId, scope: globals.scopes, immediate: false}, googleAuthResult);
	return false;
}

//------------------------------------------------------------------------------------------//

function getGoogleUser() 
{
//	gapi.client.load('plus', 'v1', function() {
//		var request = gapi.client.plus.people.get({
//			'userId': 'me'
//		});

	gapi.client.load('oauth2', 'v2', function() {
		var request = gapi.client.oauth2.userinfo.get({
			'fields': 'email,name,picture'
		});
		
		
		request.execute(function(resp) 
		{
			var heading = document.createElement('h4');
			var image = document.createElement('img');

//			if(resp.picture)
//				image.src = resp.picture;
			  
			heading.appendChild(image);
			//heading.appendChild(document.createTextNode(resp.name));
			heading.appendChild(document.createTextNode(resp.email));
			
			$("#userDisplay").append(heading);
			$("#userDisplay").fadeIn(1350);

			// no redirection if we are on tryscreen for example
			if(window.Webapp.router.currentState != undefined 
			&& window.Webapp.router.currentState.name == "home")
				window.Webapp.router.transitionTo("dashboard");
		});
	});
}