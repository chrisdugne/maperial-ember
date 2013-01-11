(function( app ) {
	'use strict';

	var DashboardView = Ember.View.extend({
		templateName: 'dashboard',
		didInsertElement: function(){
			app.DashboardController.renderUI();
		},
		willDestroyElement: function(){
			app.DashboardController.cleanUI();
		}
	});
	
	app.DashboardView = DashboardView;

})( window.Webapp);
