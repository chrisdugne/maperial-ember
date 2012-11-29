(function( app ) {
	'use strict';

	var Router = Ember.Router.extend({
	  enableLogging: true,
	  root: Ember.Route.extend({
		  //-------------------//
		  // HOME
			home: Ember.Route.extend({
			  route: '/',
			  connectOutlets: function(router){
			    router.get('applicationController').connectOutlet('home');
			  }
			}),
		  //-------------------//
		  // DASHBOARD
		    dashboard: Ember.Route.extend({
		    	route: '/dashboard',
		    	openTryscreen: Ember.Route.transitionTo('tryscreen'),
		    	connectOutlets: function(router){
		    		openView(router, "dashboard");
		    	}
		    }),
		  //-------------------//
		  // Try Screen
		    tryscreen: Ember.Route.extend({
		    	route: '/tryscreen',
		    	openHome: function(router){
		    		cleanTryscreenUI();
		    		router.transitionTo('home');
		    	},
		    	connectOutlets: function(router){
		    		openView(router, "tryscreen");
		    	}
		    })
	  })
	})

	app.Router = Router;

})( window.Webapp );


	

function openView(router, view)
{
	if(view != "tryscreen" && !window.Webapp.user.loggedIn)
		router.transitionTo("home");
	else
		router.get('applicationController').connectOutlet(view);
}

function openTryscreen()
{
	console.log("openTryscreen");
	window.Webapp.Router.transitionTo("tryscreen");
}