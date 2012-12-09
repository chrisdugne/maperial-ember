(function( app ) {
	'use strict';

	var Test2View = Ember.View.extend({
		templateName: 'test2',
		didInsertElement: function(){
			renderTest2UI();
		},
		willDestroyElement: function(){
			cleanTest2UI();
		}
	});
	
	app.Test2View = Test2View;

})( window.Webapp);

