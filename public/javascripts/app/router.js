(function( app ) {
	'use strict';

	var Router = Ember.Router.extend({
		enableLogging: true,
		root: Ember.Route.extend({
			
			//-------------------//
			// Common actions to all views
			
			openHome: Ember.Route.transitionTo('home'),
			openDashboard: Ember.Route.transitionTo('dashboard'),
			
			//-------------------//
			// Home
			
			home: Ember.Route.extend({
				route: '/',
				connectOutlets: function(router){
					router.get('applicationController').connectOutlet('home', window.Webapp.user);
				},
				openTryscreen: Ember.Route.transitionTo('tryscreen'),
				openLoginWindow: function(){app.HomeController.openLoginWindow()}
			}),
			
			//-------------------//
			// Dashboard
			
			dashboard: Ember.Route.extend({
				route: '/dashboard',
				connectOutlets: function(router){
					openView(router, "dashboard", window.Webapp.user);
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
					openView(router, "tryscreen", window.Webapp.user);
				},
				openLoginWindow: function(){app.HomeController.openLoginWindow()}
			}),
			
			//-------------------//
			// Map Creation
			
			mapCreation: Ember.Route.extend({
				route: '/mapCreation',
				connectOutlets: function(router){
					openView(router, "mapCreation", window.Webapp.user);
				}
			}),
			
			//-------------------//
			// Style Editor
			
			styleEditor: Ember.Route.extend({
				route: '/styleEditor',
				connectOutlets: function(router){
					openView(router, "styleEditor", window.Webapp.user);
				},
				openStyleSelectionWindow: function(){app.StyleEditorController.openStyleSelectionWindow()}
			}),
			
			//-------------------//
			// Colorbar Editor
			
			colorbarEditor: Ember.Route.extend({
				route: '/colorbarEditor',
				connectOutlets: function(router){
					openView(router, "colorbarEditor", window.Webapp.user);
				}
			}),
			
			//-------------------//
			// Dataset Editor
			
			datasetEditor: Ember.Route.extend({
				route: '/datasetEditor',
				connectOutlets: function(router){
					openView(router, "datasetEditor", window.Webapp.user);
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
					openView(router, "fontsEditor", window.Webapp.user);
				}
			}),
			
			//-------------------//
			// Icons Editor
			
			iconsEditor: Ember.Route.extend({
				route: '/iconsEditor',
				connectOutlets: function(router){
					openView(router, "iconsEditor", window.Webapp.user);
				}
			}),

			//----------------------------------------------------------------------------//
			// tests - à virer

			//-------------------//
			// Test 1
			
			test1: Ember.Route.extend({
				route: '/test1',
				connectOutlets: function(router){
					openView(router, "test1", window.Webapp.user);
				}
			}),
			
			//-------------------//
			// Test 2
			
			test2: Ember.Route.extend({
				route: '/test2',
				connectOutlets: function(router){
					openView(router, "test2", window.Webapp.user);
				}
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