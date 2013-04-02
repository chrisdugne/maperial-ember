
(function() {
	'use strict';

	var HomeController = Ember.ObjectController.extend({});

	//==================================================================//

	HomeController.renderUI = function()
	{
	   //$("#homeContent").bind('mousewheel', App.homeScroller.scroll);
	  // HomeController.moving = setInterval( App.homeMover.move , 40 );
	}

	HomeController.cleanUI = function()
	{
//	   clearInterval(HomeController.moving);
	}

	//==================================================================//
	// Controls

	HomeController.openLoginWindow = function() 
	{
		$('#loginWindow').modal();
	}
	
	HomeController.openVideoWindow = function() 
	{
	   window.youtubeManager.openVideoWindow();
//	   $("#videoWindow").modal();
//      $('#videoWindow').off("hide");
//      $('#videoWindow').off("show");
//      
//      $('#videoWindow').on("hide", function(){
//         App.youtubeManager.stop();
//      });
//
//      App.youtubeManager.load();
//
////      $("#videoWindow").css("left", $(window).width() - $("#videoWindow").width() );
//	   $("#videoWindow").css("left", "40%" );
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
		
		openTryscreen: function(){  App.finishLoadings("tryscreen") },
		openLoginWindow: function(){App.HomeController.openLoginWindow()},
		showVideo: function(){App.HomeController.openVideoWindow()},
		
		maperialLogin: function(){MaperialAuth.authorize()},
	});

	//==================================================================//

})();

