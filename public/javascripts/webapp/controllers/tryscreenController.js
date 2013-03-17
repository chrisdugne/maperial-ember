
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
	   App.maperial.stop();
   }
	
   //-----------------------------------------------------------------//

	TryscreenController.maperialConfig = function(){

	   var config = {hud:[], map:{}};

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
          },{ 
             type: MapParameters.Vector, 
             source: {
                type: Source.MaperialOSM
             },
             params: {
                group : VectorialLayer.BACK, 
                styles: [App.stylesData.selectedStyle.uid],
                selectedStyle: 0
             }
          },{ 
             type: MapParameters.Vector, 
             source: {
                type: Source.MaperialOSM
             },
             params: {
                group : VectorialLayer.BACK, 
                styles: [App.stylesData.selectedStyle.uid],
                selectedStyle: 0
             }
          },{ 
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
      config.hud[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  isOption : false };
      config.hud[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,    isOption : true, label : "Controls" };
      config.hud[HUD.SCALE]         = {show : true,  type : HUD.PANEL,    isOption : true, label : "Scale" };
      config.hud[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,    isOption : true, label : "Location" };
      config.hud[HUD.QUICK_EDIT]    = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Quick Style Edit" };
      config.hud[HUD.MAGNIFIER]     = {show : true,  type : HUD.TRIGGER,  isOption : true, label : "Magnifier" };

      config.hud["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud["margin-bottom"] = App.Globals.FOOTER_HEIGHT;
      
      config.edition = true;
      config.map.resizable = true;

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