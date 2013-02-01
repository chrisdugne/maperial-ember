(function() {
	'use strict';

	App.DatasetSelectionController = Ember.ObjectController.extend({});
	App.DatasetSelectionView = Ember.View.extend({
		templateName: 'datasetSelection'
	});

	App.StyleAndColorbarController = Ember.ObjectController.extend({});
	App.StyleAndColorbarView = Ember.View.extend({
	   templateName: 'styleAndColorbar',
      didInsertElement: function(){
         App.MapCreationController.renderStyleAndColorbarUI();
      },
      willDestroyElement: function(){
         App.MapCreationController.cleanStyleAndColorbarUI();
      }
	});
	
	App.GenerationController = Ember.ObjectController.extend({});
	App.GenerationView = Ember.View.extend({
	   templateName: 'generation'
	});

})( App);
