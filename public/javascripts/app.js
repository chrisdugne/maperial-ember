
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'assets/javascripts/libs/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

//Start the main app logic.
requirejs(['jquery', 
           'jquery-ui', 
           'ember', 
           'handlebars', 
           'app/utils',
           'app/router'],
	function   ($, jqueryui, ember, handlebars, utils, router) 
	{
		window.Webapp = ember.Ember.Application.create({
			VERSION: '1.0',
			rootElement: '#webappDiv',
			//storeNamespace: 'todos-emberjs',
			// Extend to inherit outlet support
			ApplicationController: ember.Ember.Controller.extend(),
			ready: function() {
				this.initialize();
			}
		});
		
		initWindowSize();
	}
);


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
