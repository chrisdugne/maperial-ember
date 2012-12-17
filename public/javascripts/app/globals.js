
this.Globals = {
	isLocal: window.location.hostname == "localhost",
	debug: false,
	googleClientId: false,
	mapServer: '//map.x-ray.fr/api',
	apiKey: 'AIzaSyCrc-COPNAP_0ysMjr8ySruAnfmImnFuH8',
	scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
	googleClientId : window.location.hostname == "localhost" ? '643408271777.apps.googleusercontent.com' : '643408271777-ss5bnucbnm5vv5gbpn0jpqcufph73das.apps.googleusercontent.com',
	APP_URL : window.location.hostname == "localhost" ? 'http://localhost:9000' : 'http://mapnify.herokuapp.com'
}	


//------------------------------------------------------//

Globals.initWindowSize = function()
{
	Globals.resizeWindow();

	$(window).resize(function() {
		Globals.resizeWindow();
	});
}

//------------------------------------------------------//

Globals.resizeWindow = function()
{
	$(document).ready(function() {
		  var webAppHeight = $(window).height() - $("#header").height() - $("#footer").height() - 100;
		  $("#webappDiv").css("min-height", webAppHeight );
		});	
}

//------------------------------------------------------//