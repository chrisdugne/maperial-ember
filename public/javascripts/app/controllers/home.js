
(function( app ) {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	HomeController.renderUI = function()
	{

	}

	HomeController.cleanUI = function()
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

