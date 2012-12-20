(function( app ) {
	'use strict';

	var PublicData = Ember.Object.extend({
		maps: Ember.A([]),
		styles: Ember.A([]),
		datasets: Ember.A([]),
		colorbars: Ember.A([]),
		fonts: Ember.A([]),
		icons: Ember.A([])
	});
	
	app.publicData = PublicData.create();
	
})( window.Webapp);
