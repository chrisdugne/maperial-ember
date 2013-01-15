(function() {
	'use strict';

	var DashboardView = Ember.View.extend({
		templateName: 'dashboard',
		didInsertElement: function(){
			App.DashboardController.renderUI();
		},
		willDestroyElement: function(){
			App.DashboardController.cleanUI();
		}
	});
	
	App.DashboardView = DashboardView;

})( App);
