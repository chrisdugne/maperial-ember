(function() {
	'use strict';

	var FontsView = Ember.View.extend({
		templateName: 'fonts',
		didInsertElement: function(){
			App.FontsController.renderUI();
		},
		willDestroyElement: function(){
			App.FontsController.cleanUI();
		}
	});
	
	App.FontsView = FontsView;

})( App);
