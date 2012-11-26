
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
// Tests

// TestExtjs 
App.TestExtjsController = Ember.ObjectController.extend();
App.TestExtjsView = Ember.View.extend({
	templateName: 'testextjs',
	didInsertElement: function(){
		renderDemoExtJS();		
	}
});

//Tryscreen 
App.TryscreenController = Ember.ObjectController.extend();
App.TryscreenView = Ember.View.extend({
	templateName: 'tryscreen',
	didInsertElement: function(){
		renderTryscreenUI();		
	}
});

//---------------------------------------------------------------------//