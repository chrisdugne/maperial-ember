
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

	app.StyleEditorController = StyleEditorController;

})( window.Webapp );

