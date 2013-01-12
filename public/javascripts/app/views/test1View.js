(function() {
	'use strict';

	var Test1View = Ember.View.extend({
		templateName: 'test1',
		didInsertElement: function(){
			App.Test1Controller.renderUI();
		},
		willDestroyElement: function(){
			App.Test1Controller.cleanUI();
		}
	});
	
	App.Test1View = Test1View;

})( App);

