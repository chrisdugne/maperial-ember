//------------------------------------------------------//
// global vars
//------------------------------------------------------//

//var isLocal = window.location.hostname == "localhost";

//------------------------------------------------------//
// User data

//var loggedIn = false;

//------------------------------------------------------//

//var DEBUG = false;

//------------------------------------------------------//

var user = User.create();

App.initialize();
resizeWindow();

$(window).resize(function() {
	resizeWindow();
});

function resizeWindow()
{
	$(document).ready(function() {
		  var webAppHeight = $(window).height() - $("#header").height() - $("#footer").height() - 100;
		  $("#webapp").css("min-height", webAppHeight );
		});	
}

//------------------------------------------------------//