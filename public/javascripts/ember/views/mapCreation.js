(function( app ) {
	'use strict';

	var MapCreationView = Ember.View.extend({
		templateName: 'mapCreation',
		didInsertElement: function(){
			renderMapCreationUI();
		},
		willDestroyElement: function(){
			cleanMapCreationUI();
		}
	});
	
	app.MapCreationView = MapCreationView;

})( window.Webapp);

//--------------------------------------------------------------------------//

function renderMapCreationUI()
{
	
}

function cleanMapCreationUI()
{
	
}
