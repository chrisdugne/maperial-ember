
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
	
	DashboardController.createMap = function()
	{
	   var map = {};
	   map.styles = [];
	   map.styles[0] = App.publicData.styles[0];
	   
	   App.mapManager.createMap(map);
      App.get('router').transitionTo('mapCreation');
	}

	//----------------------//
	
	App.DashboardController = DashboardController;

	//==================================================================//
	// Routing

	App.DashboardRouting = Ember.Route.extend({
		route: '/dashboard',
		
		connectOutlets: function(router){
		   var customContext = new Object();
		   customContext["datasetsData"] = App.datasetsData;
			App.Router.openPage(router, "dashboard", customContext);
		},
		
		//------------------------------------------//
		// actions

		//Ember.Route.transitionTo('mapCreation.datasetSelection')
		
		createMap: function(){
		   DashboardController.createMap();
      },
		styles: Ember.Route.transitionTo('styles'),
		colorbars: Ember.Route.transitionTo('colorbars'),
		datasets: Ember.Route.transitionTo('datasets'),
		icons: Ember.Route.transitionTo('icons'),
		fonts: Ember.Route.transitionTo('fonts')
	});

	//==================================================================//

})();