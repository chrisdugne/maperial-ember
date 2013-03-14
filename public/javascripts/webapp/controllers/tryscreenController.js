
(function() {
	'use strict';

	var TryscreenController = Ember.ObjectController.extend({});

	//==================================================================//

	TryscreenController.renderUI = function()
	{
	   App.user.set("waiting", true);
      
      App.stylesData.set("selectedStyle", App.publicData.styles[0]);
	   
      //-----------------------------
      // retrieve the content from the tileServer
      StyleManager.getStyle(App.stylesData.selectedStyle.uid, function(){

         var config = TryscreenController.getMapEditorConfig();
         App.user.set("waiting", false);
         App.maperial.apply(config);
      });
	}
	
	TryscreenController.cleanUI = function()
   {
	   
   }
	
   //-----------------------------------------------------------------//

	TryscreenController.getMapEditorConfig = function(){

      var config = {hud:[], map:{}};
      
      // mapEditor tools
      config.hud[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      config.hud[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Quick Style Edit" };
      config.hud[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Magnifier" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      config.edition = true;
      config.map.resizable = true;

      config.styles = [];
      config.styles[0] = App.stylesData.selectedStyle.content;
      
      return config;
	}

	//==================================================================//
	// Controls

	App.TryscreenController = TryscreenController;

	//==================================================================//
	// Routing

	App.TryscreenRouting = Ember.Route.extend({
		route: '/tryscreen',
		connectOutlets: function(router){
			App.Router.openPage(router, "tryscreen");
		},
		openLoginWindow: function(){App.HomeController.openLoginWindow()}
	});

	//==================================================================//

})();