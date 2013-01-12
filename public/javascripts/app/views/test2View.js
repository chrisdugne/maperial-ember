(function() {
	'use strict';

	var Test2View = Ember.View.extend({
		templateName: 'test2',
		didInsertElement: function(){
			App.Test2Controller.renderUI();
		},
		willDestroyElement: function(){
			App.Test2Controller.cleanUI();
		}
	});
	
	App.Test2View = Test2View;

})( App);

