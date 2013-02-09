(function() {
	'use strict';

	var DatasetsData = Ember.Object.extend({
	   filesToUpload: Ember.A([]),
	   selectedDataset : null,
	   rasterBeingConfigured : null
	});
	
	App.datasetsData = DatasetsData.create();
	
})( App);