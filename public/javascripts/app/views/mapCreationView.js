(function() {
	'use strict';

	var MapCreationView = Ember.View.extend({
		templateName: 'mapCreation',
		didInsertElement: function(){
			App.MapCreationController.renderUI();
		},
		willDestroyElement: function(){
			App.MapCreationController.cleanUI();
		}
	});
	
	App.MapCreationView = MapCreationView;

})( App);

