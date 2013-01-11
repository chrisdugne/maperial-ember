
(function( app ) {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	HomeController.renderUI = function()
	{

	}

	HomeController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//

	HomeController.openLoginWindow = function() 
	{
		$('#loginWindow').modal();
	}

	//------------------------------------------------//

	app.HomeController = HomeController;

	//------------------------------------------------//
	
	app.HomeRouting = Ember.Route.extend({
		route: '/',
		connectOutlets: function(router){
			app.Router.openView(router, "home");
		},
		openTryscreen: Ember.Route.transitionTo('tryscreen'),
		openLoginWindow: function(){app.HomeController.openLoginWindow()}
	});

	//------------------------------------------------//

})( window.Webapp );

