
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

      config.layers = [
          { 
             type: MapParameters.Vector, 
             source: {
                type: Source.MaperialOSM
             },
             params: {
                group : VectorialLayer.BACK, 
                styles: [App.stylesData.selectedStyle.uid],
                selectedStyle: 0
             }
          }
      ];
      
      // mapEditor tools
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    isOption : true, label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      config.hud.elements[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Quick Style Edit" };
      config.hud.elements[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Magnifier" };

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