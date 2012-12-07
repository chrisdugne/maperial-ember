//--------------------------------------------------------------------------//

(function( app ) {
	'use strict';

	var TryscreenView = Ember.View.extend({
		templateName: 'tryscreen',
		didInsertElement: function(){
			renderTryscreenUI();
		},
		willDestroyElement: function(){
			cleanTryscreenUI();
		}
	});
	
	app.TryscreenView = TryscreenView;

})( window.Webapp);
