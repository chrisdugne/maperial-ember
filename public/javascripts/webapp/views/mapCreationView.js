(function() {
	'use strict';

	var MapCreationView = Ember.View.extend({
		templateName: 'mapCreation',
		didInsertElement: function(){
			App.MapCreationController.init();
		},
		willDestroyElement: function(){
			App.MapCreationController.terminate();
		}
	});
	
	App.MapCreationView = MapCreationView;

})( App);

