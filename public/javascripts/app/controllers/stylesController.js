
(function( app ) {
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
		app.stylesData.set("selectedStyle", style);
	}

	//------------------------------------------------//
	
	StylesController.cancelSelectedStyle = function() 
	{
		app.stylesData.set("selectedStyle", undefined);
	}
	
	//------------------------------------------------//
	
	StylesController.deleteStyle = function(style) 
	{
		StyleManager.deleteStyle(style);
	}
	
	//------------------------------------------------//
	
	StylesController.continueStyleEdition = function() 
	{
		$("#selectStyleWindow").modal("hide");
		app.get('router').transitionTo('styleEditor');
	}

	//------------------------------------------------//
	
	app.StylesController = StylesController;

	//==================================================================//
	// Routing

	app.StylesRouting = Ember.Route.extend({
		route: '/styles',
        
		connectOutlets: function(router) {
			app.Router.openView(router, "styles");
        },

        //--------------------------------------//
        // states
        
        myStyles: Ember.Route.extend({
        	route: '/myStyles',
        	connectOutlets: function(router) {
    			var customParams = [];
    			customParams["styles"] = app.user.styles;
        		app.Router.openComponent(router, customParams);
        	}
        }),
        
        publicStyles: Ember.Route.extend({
        	route: '/publicStyles',
    		connectOutlets: function(router) {
    			var customParams = [];
    			customParams["styles"] = app.publicData.styles;
        		app.Router.openComponent(router, customParams);
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

		deleteStyle : function(router, event){
			StylesController.deleteStyle(event.context);
        }
	});

	//==================================================================//
	
})( window.Webapp );

