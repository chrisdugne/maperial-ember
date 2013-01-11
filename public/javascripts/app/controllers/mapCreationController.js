
(function( app ) {
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

	app.MapCreationController = MapCreationController;

	//==================================================================//
	// Routing

	app.MapCreationRouting = Ember.Route.extend({
		route: '/mapCreation',
		
		connectOutlets: function(router){
			app.Router.openView(router, "mapCreation");
		}
	});

	//==================================================================//
	
})( window.Webapp );