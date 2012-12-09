(function( app ) {
	'use strict';

	var Test1View = Ember.View.extend({
		templateName: 'test1',
		didInsertElement: function(){
			renderTest1UI();
		},
		willDestroyElement: function(){
			cleanTest1UI();
		}
	});
	
	app.Test1View = Test1View;

})( window.Webapp);

