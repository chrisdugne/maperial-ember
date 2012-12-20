(function( app ) {
	'use strict';

	var StyleEditorData = Ember.Object.extend({
		selectedStyle: "" // styleUID
	});
	
	app.styleEditorData = StyleEditorData.create();
	
})( window.Webapp);
