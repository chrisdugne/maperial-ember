
(function( app ) {
	'use strict';

	var DashboardController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	DashboardController.renderUI = function()
	{

	}

	DashboardController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//

	app.DashboardController = DashboardController;

	//------------------------------------------------//
	
	app.DashboardRouting = Ember.Route.extend({
		route: '/dashboard',
		connectOutlets: function(router){
			app.Router.openView(router, "dashboard");
		},
		// pages
		newMap: Ember.Route.transitionTo('mapCreation'),
		styles: Ember.Route.transitionTo('styles'),
		colorbars: Ember.Route.transitionTo('colorbars'),
		datasets: Ember.Route.transitionTo('datasets'),
		icons: Ember.Route.transitionTo('icons'),
		fonts: Ember.Route.transitionTo('fonts'),
		openTest1: Ember.Route.transitionTo('test1'),
		openTest2: Ember.Route.transitionTo('test2')
	});

	//------------------------------------------------//

})( window.Webapp );