
(function() {
	'use strict';

	var MapCreationController = Ember.ObjectController.extend({});

	//==================================================================//

	MapCreationController.renderUI = function()
	{

	}

	MapCreationController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	App.MapCreationController = MapCreationController;

	//==================================================================//
	// Routing

	App.MapCreationRouting = Ember.Route.extend({
		route: '/mapCreation',
		
		connectOutlets: function(router){
			App.Router.openView(router, "mapCreation");
		}
	});

	//==================================================================//
	
})();