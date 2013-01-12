(function() {
	'use strict';

	var StylesData = Ember.Object.extend({
		selectedStyle: null // styleUID
	});
	
	App.stylesData = StylesData.create();
	
})( App);
