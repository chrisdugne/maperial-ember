
(function( app ) {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function()
	{

	}

	HomeController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	HomeController.openLoginWindow = function() 
	{
		$('#loginWindow').modal();
	}

	//----------------------------------------------------//

	app.HomeController = HomeController;

	//==================================================================//
	// Routing

	app.HomeRouting = Ember.Route.extend({
		route: '/',
		
		connectOutlets: function(router){
			app.Router.openView(router, "home");
		},
		
		//-----------------------------------//
		// actions
		
		openTryscreen: Ember.Route.transitionTo('tryscreen'),
		openLoginWindow: function(){app.HomeController.openLoginWindow()}
	});

	//==================================================================//

})( window.Webapp );

