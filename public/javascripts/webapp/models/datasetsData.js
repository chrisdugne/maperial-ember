(function() {
	'use strict';

	var DatasetsData = Ember.Object.extend({
	   filesToUpload: Ember.A([])
	});
	
	App.datasetsData = DatasetsData.create();
	
})( App);