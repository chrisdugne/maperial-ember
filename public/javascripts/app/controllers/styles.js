
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
	
	StylesController.selectStyle = function(styleUID) 
	{
		window.Webapp.stylesData.set("selectedStyle", styleUID);
	}

	//------------------------------------------------//
	
	StylesController.cancelSelectedStyle = function() 
	{
		window.Webapp.stylesData.set("selectedStyle", undefined);
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

