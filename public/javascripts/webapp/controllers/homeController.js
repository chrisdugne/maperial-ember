
(function() {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function()
	{
	   $("#homeContent").bind('mousewheel', App.homeScroller.scroll);
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

	App.HomeController = HomeController;

	//==================================================================//
	// Routing

	App.HomeRouting = Ember.Route.extend({
		route: '/',
		
		connectOutlets: function(router){
			App.Router.openPage(router, "home");
		},
		
		//-----------------------------------//
		// actions
		
		openTryscreen: Ember.Route.transitionTo('tryscreen'),
		openLoginWindow: function(){App.HomeController.openLoginWindow()}
	});

	//==================================================================//

})();

