(function( app ) {
	'use strict';

	var StyleEditorData = Ember.Object.extend({
		selectedStyle: null // styleUID
	});
	
	app.styleEditorData = StyleEditorData.create();
	
})( window.Webapp);
