
(function( app ) {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	HomeController.renderHomeUI = function()
	{

	}

	HomeController.cleanHomeUI = function()
	{
		
	}

	//------------------------------------------------//

	HomeController.openLoginWindow = function() 
	{
		$('#loginWindow').modal();
	}

	//------------------------------------------------//

	app.HomeController = HomeController;

})( window.Webapp );

