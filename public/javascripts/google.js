//------------------------------------------------------------------------------------------//

var apiKey = 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8';
var scopes = 'https://www.googleapis.com/auth/plus.me';

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
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.get({
			'userId': 'me'
		});
		
		request.execute(function(resp) 
		{
			var heading = document.createElement('h4');
			var image = document.createElement('img');
			
			image.src = resp.image.url;
			  
			heading.appendChild(image);
			heading.appendChild(document.createTextNode(resp.displayName));
			
			$("#user").append(heading);
			$("#user").fadeIn(1350);

			App.get('router').transitionTo("dashboard");
		});
	});
}