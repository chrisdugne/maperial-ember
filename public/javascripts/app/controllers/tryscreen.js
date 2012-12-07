
(function( app ) {
	'use strict';

	var TryscreenController = Ember.ObjectController.extend({});

	app.TryscreenController = TryscreenController;

})( window.Webapp );

//--------------------------------------------------------------------------//

function renderTryscreenUI()
{
	$("#signinButton").click(openLoginWindow);
	
	renderColorBar();
	renderStyle();
	initColorPicker();
	
	renderMap();
	$(".popup").dialogr().parents('.ui-dialog').draggable('option', 'snap', true);

}

function cleanTryscreenUI()
{
	cleanColorBar();
	cleanStyle();
	cleanColorPicker();
	cleanMap();
}
