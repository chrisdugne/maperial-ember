//------------------------------------------------------------------------------------------//

var apiKey = 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8';
var scopes = 'https://www.googleapis.com/auth/plus.me';

if(isLocal)
	var clientId = '643408271777.apps.googleusercontent.com';
else
	var clientId = '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com';


//------------------------------------------------------------------------------------------//

function googleLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkGoogleAuth,1);
}

function checkGoogleAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, googleAuthResult);
}

//------------------------------------------------//

function googleAuthResult(authResult) 
{
  var signinButton = document.getElementById('signinButton');
  if (authResult && !authResult.error) 
  {
    signinButton.style.visibility = 'hidden';
    makeApiCall();
  }
  else 
  {
    signinButton.style.visibility = '';
    signinButton.onclick = openLoginWindow;
  }
}

//------------------------------------------------------------------------------------------//

function openLoginWindow() {
	$('#loginWindow').modal();
}
	
//------------------------------------------------------------------------------------------//

function googleAuthorize(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, googleAuthResult);
  return false;
}

//------------------------------------------------------------------------------------------//
// demo to remove

function makeApiCall() {
	  gapi.client.load('plus', 'v1', function() {
	      var request = gapi.client.plus.people.get({
	          'userId': 'me'
	            });
	      request.execute(function(resp) {
	          var heading = document.createElement('h4');
	          var image = document.createElement('img');
	          image.src = resp.image.url;
	          heading.appendChild(image);
	          heading.appendChild(document.createTextNode(resp.displayName));

	          document.getElementById('content').appendChild(heading);
	        });
	    });
	}