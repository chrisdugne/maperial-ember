
(function() {
	'use strict';

	var Test2Controller = Ember.ObjectController.extend({});

	//==================================================================//

	Test2Controller.renderUI = function()
	{

	}

	Test2Controller.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	App.Test2Controller = Test2Controller;

	//==================================================================//
	// Routing

	App.Test2Routing = Ember.Route.extend({
		route: '/test2',
	
		connectOutlets: function(router){
			App.Router.openView(router, "test2");
		}
	});

	//==================================================================//

})();