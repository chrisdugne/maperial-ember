(function( app ) {
	'use strict';

	var StylesData = Ember.Object.extend({
		selectedStyle: null // styleUID
	});
	
	app.stylesData = StylesData.create();
	
})( window.Webapp);
