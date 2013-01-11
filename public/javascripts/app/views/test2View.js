(function( app ) {
	'use strict';

	var Test2View = Ember.View.extend({
		templateName: 'test2',
		didInsertElement: function(){
			app.Test2Controller.renderUI();
		},
		willDestroyElement: function(){
			app.Test2Controller.cleanUI();
		}
	});
	
	app.Test2View = Test2View;

})( window.Webapp);

