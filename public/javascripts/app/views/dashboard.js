(function( app ) {
	'use strict';

	var DashboardView = Ember.View.extend({
		templateName: 'dashboard',
		didInsertElement: function(){
			renderDashboardUI();
		},
		willDestroyElement: function(){
			cleanDashboardUI();
		}
	});
	
	app.DashboardView = DashboardView;

})( window.Webapp);
