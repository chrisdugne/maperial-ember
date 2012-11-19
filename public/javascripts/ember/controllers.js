
App.ApplicationController = Ember.Controller.extend();
App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});

//App.AllContributorsController = Ember.ArrayController.extend();
//App.AllContributorsView = Ember.View.extend({
//  templateName: 'contributors'
//});
//
//App.OneContributorController = Ember.ObjectController.extend();
//App.OneContributorView = Ember.View.extend({
//  templateName: 'a-contributor'


App.HomeController = Ember.ObjectController.extend();
App.HomeView = Ember.View.extend({
  templateName: 'home'
});


