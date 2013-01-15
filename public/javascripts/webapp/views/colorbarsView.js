(function() {
	'use strict';

	var ColorbarsView = Ember.View.extend({
		templateName: 'colorbars',
		didInsertElement: function(){
			App.ColorbarsController.renderUI();
		},
		willDestroyElement: function(){
			App.ColorbarsController.cleanUI();
		}
	});
	
	App.ColorbarsView = ColorbarsView;

})( App);
