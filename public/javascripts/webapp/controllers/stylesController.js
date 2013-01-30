
(function() {
	'use strict';

	var StylesController = Ember.ObjectController.extend({});

	//==================================================================//

	StylesController.renderUI = function()
	{

	}

	StylesController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	StylesController.openStyleSelectionWindow = function() 
	{
		$('#selectStyleWindow').modal();
	}

	//------------------------------------------------//
	
	StylesController.selectStyle = function(style) 
	{
		App.stylesData.set("selectedStyle", style);
	}

	//------------------------------------------------//
	
	StylesController.cancelSelectedStyle = function() 
	{
		App.stylesData.set("selectedStyle", undefined);
	}
	
	//------------------------------------------------//
	
	StylesController.editStyle = function(style) 
	{
		App.stylesData.set("selectedStyle", style);
		App.stylesData.set("editingStyle", true);
		App.get('router').transitionTo('styleEditor');
	}
	
	//------------------------------------------------//
	
	StylesController.deleteStyle = function(style) 
	{
		StyleManager.deleteStyle(style);
	}
	
	//------------------------------------------------//
	
	/**
	 * Reach from selectStyleWindow = new style being created
	 */
	StylesController.continueStyleCreation = function() 
	{
		$("#selectStyleWindow").modal("hide");
		App.stylesData.set("editingStyle", false);
		App.get('router').transitionTo('styleEditor');
	}

	//------------------------------------------------//
	
	App.StylesController = StylesController;

	//==================================================================//
	// Routing

	App.StylesRouting = Ember.Route.extend({
		route: '/styles',
        
		connectOutlets: function(router) {
		   App.Router.openView(router, "styles");
		},

		//--------------------------------------//
		// states

		myStyles: Ember.Route.extend({
		   route: '/myStyles',
		   connectOutlets: function(router) {
		      var customParams = [];
		      customParams["styles"] = App.user.styles;
		      App.Router.openComponent(router, customParams);
		   }
		}),

		publicStyles: Ember.Route.extend({
		   route: '/publicStyles',
		   connectOutlets: function(router) {
		      var customParams = [];
		      customParams["styles"] = App.publicData.styles;
		      App.Router.openComponent(router, customParams);
		   }
		}),

		//--------------------------------------//
		// actions

		showPublicStyles: function(router){
		   StylesController.cancelSelectedStyle();
		   StylesController.openStyleSelectionWindow();
		   router.transitionTo('styles.publicStyles');
		},

		showMyStyles: Ember.Route.transitionTo('styles.myStyles'),

		selectStyle : function(router, event){
		   StylesController.selectStyle(event.context);
		},

		editStyle : function(router, event){
		   StylesController.editStyle(event.context);
		},

		deleteStyle : function(router, event){
		   StylesController.deleteStyle(event.context);
		}
	});

	//==================================================================//
	
})();

