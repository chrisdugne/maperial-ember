(function( app ) {
	'use strict';

	var Router = Ember.Router.extend({
		enableLogging: true,
		root: Ember.Route.extend({
			
			//-------------------------------------------------------//
			// Common actions to all views
			
			openHome: Ember.Route.transitionTo('home'),
			openDashboard: Ember.Route.transitionTo('dashboard'),
			
			//-------------------------------------------------------//
			// Routes used when calling Ember.Route.transitionTo
			//-------------------//
			// Home
			
			home: Ember.Route.extend({
				route: '/',
				connectOutlets: function(router){
					Router.openView(router, "home");
				},
				openTryscreen: Ember.Route.transitionTo('tryscreen'),
				openLoginWindow: function(){app.HomeController.openLoginWindow()}
			}),
			
			//-------------------//
			// Dashboard
			
			dashboard: Ember.Route.extend({
				route: '/dashboard',
				connectOutlets: function(router){
					Router.openView(router, "dashboard");
				},
				// pages
				newMap: Ember.Route.transitionTo('mapCreation'),
				styles: Ember.Route.transitionTo('styles'),
				colorbars: Ember.Route.transitionTo('colorbars'),
				datasets: Ember.Route.transitionTo('datasets'),
				icons: Ember.Route.transitionTo('icons'),
				fonts: Ember.Route.transitionTo('fonts'),
				openTest1: Ember.Route.transitionTo('test1'),
				openTest2: Ember.Route.transitionTo('test2')
			}),
			
			//-------------------//
			// Try Screen
			
			tryscreen: Ember.Route.extend({
				route: '/tryscreen',
				connectOutlets: function(router){
					Router.openView(router, "tryscreen");
				},
				openLoginWindow: function(){app.HomeController.openLoginWindow()}
			}),
			
			//-------------------//
			// Map Creation
			
			mapCreation: Ember.Route.extend({
				route: '/mapCreation',
				connectOutlets: function(router){
					Router.openView(router, "mapCreation");
				}
			}),
			
			//-------------------//
			// Styles
			
			styles: Ember.Route.extend({
				route: '/styles',
	            connectOutlets: function(router) {
					Router.openView(router, "styles");
	            },
		        myStyles: Ember.Route.extend({
		        	route: '/myStyles',
		        	connectOutlets: function(router) {
	        			var customParams = [];
	        			customParams["styles"] = window.Webapp.user.styles;
		        		Router.openComponent(router, customParams);
		        	}
		        }),
		        publicStyles: Ember.Route.extend({
		        	route: '/publicStyles',
	        		connectOutlets: function(router) {
	        			var customParams = [];
	        			customParams["styles"] = window.Webapp.publicData.styles;
		        		Router.openComponent(router, customParams);
	        		}
		        }),
		        showPublicStyles: function(router){
		        	app.StylesController.openStyleSelectionWindow();
		        	router.transitionTo('styles.publicStyles');
		        },
		        showMyStyles: Ember.Route.transitionTo('styles.myStyles')
			}),

			
			styleEditor: Ember.Route.extend({
				route: '/styleEditor',
				connectOutlets: function(router) {
					Router.openView(router, "styleEditor");
				}
			}),
			
			//-------------------//
			// Colorbar
			
			colorbars: Ember.Route.extend({
				route: '/colorbars',
				connectOutlets: function(router){
					Router.openView(router, "colorbars");
				}
			}),
			
			//-------------------//
			// Dataset
			
			datasets: Ember.Route.extend({
				route: '/datasets',
				connectOutlets: function(router){
					Router.openView(router, "datasets");
				},
				deleteDataset: function(router, event){
					var dataset = event.context;
					DatasetManager.deleteDataset(dataset);
				},
				openUploadWindow: function(){app.DatasetsController.openUploadWindow()}
				
			}),
			
			//-------------------//
			// Fonts
			
			fonts: Ember.Route.extend({
				route: '/fonts',
				connectOutlets: function(router){
					Router.openView(router, "fonts");
				}
			}),
			
			//-------------------//
			// Icons
			
			icons: Ember.Route.extend({
				route: '/icons',
				connectOutlets: function(router){
					Router.openView(router, "icons");
				}
			}),

			//----------------------------------------------------------------------------//
			// tests - à virer

			//-------------------//
			// Test 1
			
			test1: Ember.Route.extend({
				route: '/test1',
				connectOutlets: function(router){
					Router.openView(router, "test1");
				}
			}),
			
			//-------------------//
			// Test 2
			
			test2: Ember.Route.extend({
				route: '/test2',
				connectOutlets: function(router){
					Router.openView(router, "test2");
				}
			}),
			
		})
	})
	
	//-----------------------------------------------------------------------------------------//
	
	/**
	 * the main purpose of Router.openView is to check if user.isLoggedIn
	 * the second purpose is to create a full context, when no specific context is required
	 */
	Router.openView = function (router, view, context)
	{
		if(view != "home" && view != "tryscreen" && !window.Webapp.user.loggedIn)
		{
			console.log("Not connected ! Redirected to the home page");
			router.transitionTo('home');
		}
		else{
			if(context == undefined)
			{
				// either we need a specific context = not undefined
				// or we need everything = what happens below 
				// or we need nothing = not matter if something is in the context
				context = new Object();
				context["user"] = window.Webapp.user;
				context["publicData"] = window.Webapp.publicData;
			}

			// binding controller's data
			context[view+"Data"] = window.Webapp[view+"Data"];	
			
			// storing currentView
			context["currentView"] = view;

			router.get('applicationController').connectOutlet(view, context);
		}
	}

	//-----------------------------------------------------------------------------------------//

	/**
	 * Load a component with the parentController as context
	 * Append the customParams in the context
	 */
	Router.openComponent = function (router, customParams)
	{
		var view = router.currentState.name;
		var controller = Router.getMainController(router);
		
		// Router initializing
		if(controller == null)
			return;
		
		var context = new Object();
		context["controllerData"] = window.Webapp[controller + "Data"];
		context["currentView"] = view;
		
		for(var property in customParams) {
			if (customParams.hasOwnProperty(property)) {
				context[property] = customParams[property];
			}
		}
		
		router.get(controller+"Controller").connectOutlet(view, context);
	}

	//-----------------------------------------------------------------------------------------//

	/**
	 * Retrieve to top controller's name (the currentPage, just under 'root')
	 * with this controllerName :
	 * 	- we can reach the model "controllerNameData" to push in the context
	 * 	- we can reach the actual Ember.Controller "controllerNameController" to connect the outlet
	 */
	Router.getMainController = function (router)
	{
		// Ember.Router initialisation calls Router.openComponent : nothing to do here
		if(router.currentState.parentState.name == "root")
			return null;
		
		var parentState = router.currentState.parentState;
		
		while(parentState.parentState.name != "root")
			parentState = parentState.parentState;
		
		return parentState.name;
	}
			
	//-----------------------------------------------------------------------------------------//
		
	app.Router = Router;

	//-----------------------------------------------------------------------------------------//
	
})( window.Webapp );
