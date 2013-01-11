
(function( app ) {
	'use strict';

	var Test2Controller = Ember.ObjectController.extend({});

	//------------------------------------------------//

	Test2Controller.renderUI = function()
	{

	}

	Test2Controller.cleanUI = function()
	{
		
	}

	//------------------------------------------------//
	
	app.Test2Controller = Test2Controller;
	
	//------------------------------------------------//

	app.Test2Routing = Ember.Route.extend({
		route: '/test2',
		connectOutlets: function(router){
			app.Router.openView(router, "test2");
		}
	});

	//------------------------------------------------//

})( window.Webapp );