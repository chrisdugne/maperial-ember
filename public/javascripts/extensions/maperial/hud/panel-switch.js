/**
 * Listens the switch panel
 */
HUD.prototype.refreshSwitchImagesPanel = function() {

   console.log("     building switch...");
   
   var layersManager = this.maperial.layersManager;
   
   $("#imagesMapquest").click(function(){
      layersManager.switchImagesTo(Source.IMAGES_MAPQUEST)
   });

   $("#imagesMapquestSatellite").click(function(){
      layersManager.switchImagesTo(Source.IMAGES_MAPQUEST_SATELLITE)
   });

   $("#imagesOSM").click(function(){
      layersManager.switchImagesTo(Source.IMAGES_OSM)
   });
}