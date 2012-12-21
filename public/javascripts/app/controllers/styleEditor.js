
(function( app ) {
	'use strict';

	var StyleEditorController = Ember.ObjectController.extend({});

	//------------------------------------------------//

	StyleEditorController.renderUI = function()
	{

	}

	StyleEditorController.cleanUI = function()
	{
		
	}

	//------------------------------------------------//

	StyleEditorController.openStyleSelectionWindow = function() 
	{
		$('#selectStyleWindow').modal();
	}

	//------------------------------------------------//
	
	StyleEditorController.selectStyle = function(styleUID) 
	{
		console.log(styleUID);
		window.Webapp.styleEditorData.set("selectedStyle", styleUID);
	}

	//------------------------------------------------//

	app.StyleEditorController = StyleEditorController;

})( window.Webapp );

