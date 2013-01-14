(function() {
	'use strict';

	var StylesData = Ember.Object.extend({
		selectedStyle: null, // styleUID
		map: null // GLMap			
	});
	
	App.stylesData = StylesData.create();
	
})( App);
