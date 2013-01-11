
(function( app ) {
	'use strict';

	var FontsController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	FontsController.renderUI = function()
	{

	}

	FontsController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//
	
	app.FontsController = FontsController;
	
	//------------------------------------------------//

	app.FontsRouting = Ember.Route.extend({
		route: '/fonts',
		connectOutlets: function(router){
			app.Router.openView(router, "fonts");
		}
	});

	//------------------------------------------------//

})( window.Webapp );