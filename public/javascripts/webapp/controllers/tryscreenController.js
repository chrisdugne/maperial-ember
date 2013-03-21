
(function() {
	'use strict';

	var TryscreenController = Ember.ObjectController.extend({});

	//==================================================================//

	TryscreenController.renderUI = function()
	{
      App.stylesData.set("selectedStyle", App.publicData.styles[0]);
      App.maperial.apply(TryscreenController.maperialConfig());
	}
	
	TryscreenController.cleanUI = function()
   {
	   App.maperial.reset();
   }
	
   //-----------------------------------------------------------------//

	TryscreenController.maperialConfig = function(){

	   var config = {hud:{elements:{}, options:{}}};

      // mapEditor tools
      // maperial hud
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    label : "Scale",    position : { right: "10", bottom: "10"} };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    label : "Location" };
      config.hud.elements[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  label : "Quick Style Edit" };
      config.hud.elements[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  label : "Magnifier" };
      
      config.hud.options["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud.options["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      config.edition = true;

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