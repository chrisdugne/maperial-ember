
(function( app ) {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	app.HomeController = HomeController;

})( window.Webapp );

//--------------------------------------------------------------------------//

function renderHomeUI()
{
	$("#signinButton").click(openLoginWindow);
}

function cleanHomeUI()
{
	
}

//------------------------------------------------//

function openLoginWindow() 
{
	$('#loginWindow').modal();
}