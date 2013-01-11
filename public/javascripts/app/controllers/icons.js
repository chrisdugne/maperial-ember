
(function( app ) {
	'use strict';

	var IconsController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	IconsController.renderUI = function()
	{

	}

	IconsController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//
	
	app.IconsController = IconsController;
	
	//------------------------------------------------//

	app.IconsRouting = Ember.Route.extend({
		route: '/icons',
		connectOutlets: function(router){
			app.Router.openView(router, "icons");
		}
	});

	//------------------------------------------------//

})( window.Webapp );