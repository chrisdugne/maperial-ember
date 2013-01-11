
(function( app ) {
	'use strict';

	var StylesController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	StylesController.renderUI = function()
	{

	}

	StylesController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//

	StylesController.openStyleSelectionWindow = function() 
	{
		$('#selectStyleWindow').modal();
	}

	//------------------------------------------------//
	
	StylesController.selectStyle = function(style) 
	{
		window.Webapp.stylesData.set("selectedStyle", style);
	}

	//------------------------------------------------//
	
	StylesController.cancelSelectedStyle = function() 
	{
		window.Webapp.stylesData.set("selectedStyle", undefined);
	}
	
	//------------------------------------------------//
	
	StylesController.deleteStyle = function(style) 
	{
		console.log(style);
		StyleManager.deleteStyle(style);
	}
	
	//------------------------------------------------//
	
	StylesController.continueStyleEdition = function() 
	{
		$("#selectStyleWindow").modal("hide");
		window.Webapp.get('router').transitionTo('styleEditor');
	}

	//------------------------------------------------//

	app.StylesController = StylesController;


	//------------------------------------------------//

	app.StylesRouting = Ember.Route.extend({
		route: '/styles',
        connectOutlets: function(router) {
			app.Router.openView(router, "styles");
        },
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
        showPublicStyles: function(router){
        	app.StylesController.cancelSelectedStyle();
        	app.StylesController.openStyleSelectionWindow();
        	router.transitionTo('styles.publicStyles');
        },
        showMyStyles: Ember.Route.transitionTo('styles.myStyles')
	});

	//------------------------------------------------//
	
})( window.Webapp );

