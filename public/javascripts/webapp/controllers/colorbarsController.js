
(function() {
	'use strict';

	var ColorbarsController = Ember.ObjectController.extend({});

	//==================================================================//

	ColorbarsController.renderUI = function()
	{

	}

	ColorbarsController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	ColorbarsController.openColorbarSelectionWindow = function() 
	{
		$('#selectColorbarWindow').modal();
	}

	//------------------------------------------------//
	
	ColorbarsController.selectColorbar = function(colorbar) 
	{
		App.colorbarsData.set("selectedColorbar", colorbar);
	}

	//------------------------------------------------//
	
	ColorbarsController.cancelSelectedColorbar = function() 
	{
		App.colorbarsData.set("selectedColorbar", undefined);
	}
	
	//------------------------------------------------//
	
	ColorbarsController.editColorbar = function(colorbar) 
	{
		App.colorbarsData.set("selectedColorbar", colorbar);
		App.colorbarsData.set("editingColorbar", true);
		App.get('router').transitionTo('colorbarEditor');
	}
	
	//------------------------------------------------//
	
	ColorbarsController.deleteColorbar = function(colorbar) 
	{
		ColorbarManager.deleteColorbar(colorbar);
	}
	
	//------------------------------------------------//
	
	ColorbarsController.continueColorbarEdition = function() 
	{
		$("#selectColorbarWindow").modal("hide");
		App.colorbarsData.set("editingColorbar", true);
		App.get('router').transitionTo('colorbarEditor');
	}

	//------------------------------------------------//
	
	App.ColorbarsController = ColorbarsController;

	//==================================================================//
	// Routing

	App.ColorbarsRouting = Ember.Route.extend({
		route: '/colorbars',
        
		connectOutlets: function(router) {
			App.Router.openView(router, "colorbars");
        },

        //--------------------------------------//
        // states
        
        myColorbars: Ember.Route.extend({
        	route: '/myColorbars',
        	connectOutlets: function(router) {
    			var customParams = [];
    			customParams["colorbars"] = App.user.colorbars;
        		App.Router.openComponent(router, customParams);
        	}
        }),
        
        publicColorbars: Ember.Route.extend({
        	route: '/publicColorbars',
    		connectOutlets: function(router) {
    			var customParams = [];
    			customParams["colorbars"] = App.publicData.colorbars;
        		App.Router.openComponent(router, customParams);
    		}
        }),

        //--------------------------------------//
        // actions
        
        showPublicColorbars: function(router){
        	ColorbarsController.cancelSelectedColorbar();
        	ColorbarsController.openColorbarSelectionWindow();
        	router.transitionTo('colorbars.publicColorbars');
        },
        
        showMyColorbars: Ember.Route.transitionTo('colorbars.myColorbars'),

        selectColorbar : function(router, event){
			ColorbarsController.selectColorbar(event.context);
		},

		editColorbar : function(router, event){
			ColorbarsController.editColorbar(event.context);
		},

		deleteColorbar : function(router, event){
			ColorbarsController.deleteColorbar(event.context);
        }
	});

	//==================================================================//
	
})();