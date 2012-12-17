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

	Globals.initWindowSize();
	
})( window );