(function() {
	'use strict';

	var StylesData = Ember.Object.extend({
		selectedStyle: null, // style.uid, style.name, style.content
		map: null // GLMap			
	});
	
	App.stylesData = StylesData.create();
	
})( App);
