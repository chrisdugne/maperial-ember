
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

})( window.Webapp );

