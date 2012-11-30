//--------------------------------------------------------------------------//

(function( app ) {
	'use strict';

	var TryscreenView = Ember.View.extend({
		templateName: 'tryscreen',
		didInsertElement: function(){
			renderTryscreenUI();
		},
		willDestroyElement: function(){
			cleanTryscreenUI();
		}
	});
	
	app.TryscreenView = TryscreenView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderTryscreenUI()
{
	$("#tryButton").hide();
	
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
	
	$("#tryButton").show();
}
