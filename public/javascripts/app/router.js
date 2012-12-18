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
				newStyle: Ember.Route.transitionTo('styleEditor'),
				newColorbar: Ember.Route.transitionTo('colorbarEditor'),
				newDataset: Ember.Route.transitionTo('datasetEditor'),
				manageIcons: Ember.Route.transitionTo('iconsEditor'),
				manageFonts: Ember.Route.transitionTo('fontsEditor'),
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
			// Style Editor
			
			styleEditor: Ember.Route.extend({
				route: '/styleEditor',
	            connectOutlets: function(router) {
					Router.openView(router, "styleEditor");
	            },
		        myStyles: Ember.Route.extend({
		        	route: '/myStyles',
		        	connectOutlets: function(router) {
		        		Router.openComponent(router, "styleEditorController", "myStyles", "styles", window.Webapp.user.styles);
		        	}
		        }),
		        publicStyles: Ember.Route.extend({
		        	route: '/publicStyles',
	        		connectOutlets: function(router) {
	        			Router.openComponent(router, "styleEditorController", "publicStyles", "styles", window.Webapp.publicData.styles);
	        		}
		        }),
		        showPublicStyles: function(router){
		        	app.StyleEditorController.openStyleSelectionWindow();
		        	router.transitionTo('styleEditor.publicStyles');
		        },
		        showMyStyles: Ember.Route.transitionTo('styleEditor.myStyles')
			}),
			
			//-------------------//
			// Colorbar Editor
			
			colorbarEditor: Ember.Route.extend({
				route: '/colorbarEditor',
				connectOutlets: function(router){
					Router.openView(router, "colorbarEditor");
				}
			}),
			
			//-------------------//
			// Dataset Editor
			
			datasetEditor: Ember.Route.extend({
				route: '/datasetEditor',
				connectOutlets: function(router){
					Router.openView(router, "datasetEditor");
				},
				deleteDataset: function(router, event){
					var dataset = event.context;
					DatasetManager.deleteDataset(dataset);
				},
				openUploadWindow: function(){app.DatasetEditorController.openUploadWindow()}
				
			}),
			
			//-------------------//
			// Fonts Editor
			
			fontsEditor: Ember.Route.extend({
				route: '/fontsEditor',
				connectOutlets: function(router){
					Router.openView(router, "fontsEditor");
				}
			}),
			
			//-------------------//
			// Icons Editor
			
			iconsEditor: Ember.Route.extend({
				route: '/iconsEditor',
				connectOutlets: function(router){
					Router.openView(router, "iconsEditor");
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

			context["currentView"] = view;
			router.get('applicationController').connectOutlet(view, context);
		}
	}

	//-----------------------------------------------------------------------------------------//

	/**
	 * Load a component with a specific context
	 */
	Router.openComponent = function (router, controller, subView, contextProperty, data)
	{
		var context = new Object();
		context[contextProperty] = data;
		context["currentView"] = subView;
		router.get(controller).connectOutlet(subView, context);
	}

	//-----------------------------------------------------------------------------------------//
		
	app.Router = Router;

	//-----------------------------------------------------------------------------------------//
	
})( window.Webapp );
