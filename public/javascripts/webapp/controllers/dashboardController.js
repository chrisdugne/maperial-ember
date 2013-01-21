
(function() {
	'use strict';

	var DashboardController = Ember.ObjectController.extend({});

	//==================================================================//
	
	DashboardController.renderUI = function()
	{

	}

	DashboardController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	App.DashboardController = DashboardController;

	//==================================================================//
	// Routing

	App.DashboardRouting = Ember.Route.extend({
		route: '/dashboard',
		
		connectOutlets: function(router){
			App.Router.openView(router, "dashboard");
		},
		
		//------------------------------------------//
		// actions
		
		newMap: Ember.Route.transitionTo('mapCreation'),
		styles: Ember.Route.transitionTo('styles'),
		colorbars: Ember.Route.transitionTo('colorbars'),
		datasets: Ember.Route.transitionTo('datasets'),
		icons: Ember.Route.transitionTo('icons'),
		fonts: Ember.Route.transitionTo('fonts')
	});

	//==================================================================//

})();