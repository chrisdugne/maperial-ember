
(function( app ) {
	'use strict';

	var ColorbarsController = Ember.ObjectController.extend({});

	//==================================================================//

	ColorbarsController.renderUI = function()
	{

	}

	ColorbarsController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	app.ColorbarsController = ColorbarsController;

	//==================================================================//
	// Routing

	app.ColorbarsRouting = Ember.Route.extend({
		route: '/colorbars',
		connectOutlets: function(router){
			app.Router.openView(router, "colorbars");
		}
	});

	//==================================================================//
	
})( window.Webapp );