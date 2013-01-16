(function() {
	'use strict';

	var StylesData = Ember.Object.extend({
		selectedStyle: null, // style.uid, style.name, style.content
		editingStyle: null, // styleEditor | editingStyle = true : edition | editingStyle = false : newStyle 
		map: null // GLMap			
	});
	
	App.stylesData = StylesData.create();
	
})( App);