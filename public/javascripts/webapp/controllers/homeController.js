
(function() {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function()
	{
	   $("#homeContent").bind('mousewheel', App.homeScroller.scroll);
	}

	HomeController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	HomeController.openLoginWindow = function() 
	{
		$('#loginWindow').modal();
	}
	
	HomeController.openVideoWindow = function() 
	{

	   $("#videoWindow").modal();
      $('#videoWindow').off("hide");
      $('#videoWindow').off("show");
      
      $('#videoWindow').on("hide", function(){
         App.youtubeManager.stop();
      });

      App.youtubeManager.load();

//      $("#videoWindow").css("left", $(window).width() - $("#videoWindow").width() );
	   $("#videoWindow").css("left", "40%" );
	}

	//----------------------------------------------------//

	App.HomeController = HomeController;

	//==================================================================//
	// Routing

	App.HomeRouting = Ember.Route.extend({
		route: '/',
		
		connectOutlets: function(router){
			App.Router.openPage(router, "home");
		},
		
		//-----------------------------------//
		// actions
		
		openTryscreen: Ember.Route.transitionTo('tryscreen'),
		openLoginWindow: function(){App.HomeController.openLoginWindow()},
		showVideo: function(){App.HomeController.openVideoWindow()}
	});

	//==================================================================//

})();

