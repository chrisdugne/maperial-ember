
(function( app ) {
	'use strict';

	var IconsController = Ember.ObjectController.extend({});

	//==================================================================//

	IconsController.renderUI = function()
	{

	}

	IconsController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	app.IconsController = IconsController;

	//==================================================================//
	// Routing

	app.IconsRouting = Ember.Route.extend({
		route: '/icons',
	
		connectOutlets: function(router){
			app.Router.openView(router, "icons");
		}
	});

	//==================================================================//

})( window.Webapp );