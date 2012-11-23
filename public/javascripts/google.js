//------------------------------------------------------------------------------------------//

var apiKey = 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8';
//var scopes = 'https://www.googleapis.com/auth/plus.me';
var scopes = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
//var scopes = 'https://www.googleapis.com/auth/userinfo.email';

if(isLocal)
	var clientId = '643408271777.apps.googleusercontent.com';
else
	var clientId = '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com';

 
//------------------------------------------------------------------------------------------//

function googleLoad() 
{
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkGoogleAuth,1);
}

function checkGoogleAuth() 
{
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, googleAuthResult);
}

//------------------------------------------------//

function googleAuthResult(authResult) 
{
	if (authResult && !authResult.error) 
	{
		loggedIn = true;
		$("#signinButton").fadeOut(1350);
		getGoogleUser();
	}
	else 
	{
		$("#signinButton").click(openLoginWindow);
		App.get('router').transitionTo("home");
	}
}

//------------------------------------------------------------------------------------------//

function openLoginWindow() 
{
	$('#loginWindow').modal();
}
	
function googleAuthorize(event) 
{
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, googleAuthResult);
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
			heading.appendChild(document.createTextNode(resp.name));
			heading.appendChild(document.createTextNode(resp.email));
			
			$("#user").append(heading);
			$("#user").fadeIn(1350);

			App.get('router').transitionTo("dashboard");
		});
	});
}