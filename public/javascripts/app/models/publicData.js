(function( app ) {
	'use strict';

	var PublicData = Ember.Object.extend({
		maps: Ember.Array,
		styles: Ember.Array,
		datasets: Ember.Array,
		colorbars: Ember.Array,
		fonts: Ember.Array,
		icons: Ember.Array
	});
	
	app.publicData = PublicData.create();
	
})( window.Webapp);
