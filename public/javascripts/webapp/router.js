(function() {
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
			
			home: App.HomeRouting,
			tryscreen: App.TryscreenRouting,
			dashboard: App.DashboardRouting,
			
			styles: App.StylesRouting,
			styleEditor: App.StyleEditorRouting,
			
			colorbars: App.ColorbarsRouting,
			colorbarEditor: App.ColorbarEditorRouting,

			datasets: App.DatasetsRouting,
			fonts: App.FontsRouting,
			icons: App.IconsRouting,

			mapCreation: App.MapCreationRouting
		})
	})
	
	//-----------------------------------------------------------------------------------------//
	
	/**
	 * the main purpose of Router.openView is to check if user.isLoggedIn
	 * the second purpose is to create a full context, adding the customContext to everything else
	 * 
	 * context : may contain additional models required for the view
	 * exemple 
	 * connectOutlets: function(router){
         var customContext = new Object();
         customContext["datasetsData"] = App.datasetsData;
         App.Router.openView(router, "dashboard", customContext);
      }, 
      
      the custom context is added to the glabal context containing
       - user
       - publicData
       - viewData
       - currentView
	 */
	Router.openView = function (router, view, customContext)
	{
		if(view != "home" && view != "tryscreen" && !App.user.loggedIn)
		{
			console.log("Not connected ! Redirected to the home page");
			router.transitionTo('home');
		}
		else{
			var context = Router.buildGlobalContext(customContext, view);
			router.get('applicationController').connectOutlet(view, context);
		}
	}

	//-----------------------------------------------------------------------------------------//

	Router.buildGlobalContext = function (customContext, view){
	   
	   var context;
	 
	   if(customContext == undefined)
         context = new Object();
	   else
	      context = customContext;

      context["user"] = App.user;
      context["publicData"] = App.publicData;

      // binding controller's data
      context[view+"Data"] = App[view+"Data"];  
      
      // storing currentView
      context["currentView"] = view;
      
      return context;
	}

	//-----------------------------------------------------------------------------------------//

	/**
	 * Load a component with the parentController as context
	 * context : alike Router.openView
	 */
	Router.openComponent = function (router, customContext)
	{
		var view = router.currentState.name;
		var controller = Router.getMainController(router);
		
		// Router initializing
		if(controller == null)
			return;

      var context = Router.buildGlobalContext(customContext, view);

      context[controller + "Data"] = App[controller + "Data"];
		context["currentView"] = view;
		
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
		
	App.Router = Router;

	//-----------------------------------------------------------------------------------------//
	
})();
