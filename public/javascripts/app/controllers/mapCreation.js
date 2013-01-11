
(function( app ) {
	'use strict';

	var MapCreationController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	MapCreationController.renderUI = function()
	{

	}

	MapCreationController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//
	
	app.MapCreationController = MapCreationController;

	//------------------------------------------------//

	app.MapCreationRouting = Ember.Route.extend({
		route: '/mapCreation',
		connectOutlets: function(router){
			app.Router.openView(router, "mapCreation");
		}
	});

	//------------------------------------------------//
	
})( window.Webapp );