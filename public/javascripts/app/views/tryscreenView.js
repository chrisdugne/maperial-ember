//--------------------------------------------------------------------------//

(function( app ) {
	'use strict';

	var TryscreenView = Ember.View.extend({
		templateName: 'tryscreen',
		didInsertElement: function(){
			app.TryscreenController.renderUI();
		},
		willDestroyElement: function(){
			app.TryscreenController.cleanUI();
		}
	});
	
	app.TryscreenView = TryscreenView;

})( window.Webapp);
