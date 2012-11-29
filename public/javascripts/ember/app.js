(function( win ) {
	'use strict';

	win.Webapp = Ember.Application.create({
		VERSION: '1.0',
		rootElement: '#webappDiv',
		//storeNamespace: 'todos-emberjs',
		// Extend to inherit outlet support
		ApplicationController: Ember.Controller.extend(),
		ready: function() {
			this.initialize();
		}
	});

	initWindowSize();
	
})( window );


//------------------------------------------------------//

function initWindowSize()
{
	resizeWindow();

	$(window).resize(function() {
		resizeWindow();
	});
}

//------------------------------------------------------//

function resizeWindow()
{
	$(document).ready(function() {
		  var webAppHeight = $(window).height() - $("#header").height() - $("#footer").height() - 100;
		  $("#webappDiv").css("min-height", webAppHeight );
		});	
}

//------------------------------------------------------//