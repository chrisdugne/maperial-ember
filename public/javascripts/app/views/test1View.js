(function( app ) {
	'use strict';

	var Test1View = Ember.View.extend({
		templateName: 'test1',
		didInsertElement: function(){
			app.Test1Controller.renderUI();
		},
		willDestroyElement: function(){
			app.Test1Controller.cleanUI();
		}
	});
	
	app.Test1View = Test1View;

})( window.Webapp);

