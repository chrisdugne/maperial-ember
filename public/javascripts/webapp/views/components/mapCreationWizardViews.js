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

   App.SettingsController = Ember.ObjectController.extend({});
   App.SettingsView = Ember.View.extend({
      templateName: 'settings',
      didInsertElement: function(){
         App.MapCreationController.renderSettingsUI();
      },
      willDestroyElement: function(){
         App.MapCreationController.cleanSettingsUI();
      }
   });

})( App);
