
//-------------------------------------------------//
// Application container

App.ApplicationController = Ember.Controller.extend();
App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});

//-------------------------------------------------//
// Views

// Home : http://mapnify.herokuapp.com/
App.HomeController = Ember.ObjectController.extend();
App.HomeView = Ember.View.extend({
  templateName: 'home'
});

// Dashboard 
App.DashboardController = Ember.ObjectController.extend();
App.DashboardView = Ember.View.extend({
	templateName: 'dashboard'
});

//---------------------------------------------------------------------//
// DEMO

//App.AllContributorsController = Ember.ArrayController.extend();
//App.AllContributorsView = Ember.View.extend({
//  templateName: 'contributors'
//});
//
//App.OneContributorController = Ember.ObjectController.extend();
//App.OneContributorView = Ember.View.extend({
//  templateName: 'a-contributor'