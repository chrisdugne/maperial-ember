(function( app ) {
	'use strict';

	var Router = Ember.Router.extend({
	  enableLogging: true,
	  root: Ember.Route.extend({
		  openHome: Ember.Route.transitionTo('home'),
		  //-------------------//
		  // HOME
			home: Ember.Route.extend({
			  route: '/',
			  connectOutlets: function(router){
			    router.get('applicationController').connectOutlet('home', window.Webapp.user);
			  },
			  openTryscreen: Ember.Route.transitionTo('tryscreen'),
			  openDashboard: Ember.Route.transitionTo('dashboard')
			}),
		  //-------------------//
		  // DASHBOARD
		    dashboard: Ember.Route.extend({
		    	route: '/dashboard',
		    	connectOutlets: function(router){
		    		openView(router, "dashboard");
		    	}
		    }),
		  //-------------------//
		  // Try Screen
		    tryscreen: Ember.Route.extend({
		    	route: '/tryscreen',
		    	connectOutlets: function(router){
		    		openView(router, "tryscreen", window.Webapp.user);
		    	},
			    openDashboard: Ember.Route.transitionTo('dashboard')
		    })
	  })
	})

	app.Router = Router;
})( window.Webapp );


function openView(router, view, context)
{
	if(view != "tryscreen" && !window.Webapp.user.loggedIn)
		router.transitionTo("home");
	else
		router.get('applicationController').connectOutlet(view, context);
}