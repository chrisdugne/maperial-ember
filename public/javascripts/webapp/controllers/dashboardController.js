
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
	   var map = {uid : null, name : "New Map"};

      App.user.set("selectedMap", map);
      App.get('router').transitionTo('mapCreation');
	}

	DashboardController.editMap = function(map)
	{
	   console.log("editmap");
	   console.log(map);
	   App.user.set("selectedMap", map);
	   App.get('router').transitionTo('mapCreation');
	}
	
	DashboardController.deleteMap = function(map)
	{
	   App.mapManager.deleteMap(map);
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

		createMap: function(){
		   DashboardController.createMap();
      },
      
      editMap: function(router, event){
         var map = event.context;
         DashboardController.editMap(map);
      },
      
      deleteMap: function(router, event){
         var map = event.context;
         DashboardController.deleteMap(map);
      },
      
		styles: Ember.Route.transitionTo('styles'),
		colorbars: Ember.Route.transitionTo('colorbars'),
		datasets: Ember.Route.transitionTo('datasets'),
		icons: Ember.Route.transitionTo('icons'),
		fonts: Ember.Route.transitionTo('fonts')
	});

	//==================================================================//

})();