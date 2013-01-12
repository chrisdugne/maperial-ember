
(function() {
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

	App.ColorbarsController = ColorbarsController;

	//==================================================================//
	// Routing

	App.ColorbarsRouting = Ember.Route.extend({
		route: '/colorbars',
		connectOutlets: function(router){
			App.Router.openView(router, "colorbars");
		}
	});

	//==================================================================//
	
})();